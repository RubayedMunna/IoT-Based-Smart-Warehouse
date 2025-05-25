#include <DHT.h>
#include <ESP32Servo.h>
#include <WiFi.h>
#include <HTTPClient.h>

// Wi-Fi credentials
const char* ssid = "pc78";
const char* password = "12345678";

// ThingSpeak settings
const char* thingSpeakServer = "api.thingspeak.com";
const String writeAPIKey = "HLGASKZXTG9V20G9";
unsigned long lastThingSpeakUpdate = 0;
const unsigned long thingSpeakInterval = 15000;

// TalkBack settings
const String talkBackId = "54806";
const String talkBackApiKey = "37XIT8J7J51VN4CO";
unsigned long lastTalkBackCheck = 0;
const unsigned long talkBackInterval = 5000;

// Pin definitions
const int flamePin = 32;
const int mq2Pin = 34;
// MQ135 pin still declared in case you reconnect later
const int mq135Pin = 26;
const int dhtPin = 5;
const int relayPumpPin = 13;
const int relayFanPin = 12;
const int servoPin = 23;
const int buzzerPin = 4;

// Thresholds
const int flameThreshold = 3000;
const int gasThreshold = 1800;
const float humidityThreshold = 50.0;
const float tempThreshold = 30.0;

// Sensor and actuator setup
#define DHTTYPE DHT22
DHT dht(dhtPin, DHTTYPE);
Servo servoMotor;

float humidity = NAN;
float temperature = NAN;
unsigned long lastDHTRead = 0;
const unsigned long dhtInterval = 2000;
unsigned long lastDHTReinit = 0;
const unsigned long dhtReinitCooldown = 10000;
int servoAngle = 0;

void setup() {
  Serial.begin(9600);

  pinMode(flamePin, INPUT);
  pinMode(mq2Pin, INPUT);
  pinMode(mq135Pin, INPUT);  // Optional: still keep as INPUT
  pinMode(relayPumpPin, OUTPUT);
  pinMode(relayFanPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);

  digitalWrite(relayPumpPin, HIGH);
  digitalWrite(relayFanPin, HIGH);
  noTone(buzzerPin);

  servoMotor.attach(servoPin);
  servoMotor.write(servoAngle);

  dht.begin();
  randomSeed(analogRead(0));  // Initialize random generator

  // Wi-Fi connection
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  Serial.println("System Initialized: Flame, MQ2, MQ135 (Simulated), DHT22, Relays, Servo, WiFi");
}

void checkTalkBack() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "http://" + String(thingSpeakServer) + "/talkbacks/" + talkBackId + "/commands/execute.json?api_key=" + talkBackApiKey;

    http.begin(url);
    int httpCode = http.GET();
    if (httpCode > 0 && httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.print("TalkBack response: ");
      Serial.println(payload);

      if (payload.indexOf("OPEN") >= 0) {
        servoAngle = 90;
        servoMotor.write(servoAngle);
        Serial.println("Door Opening (90°)");
      } else if (payload.indexOf("CLOSE") >= 0) {
        servoAngle = 0;
        servoMotor.write(servoAngle);
        Serial.println("Door Closing (0°)");
      } else {
        Serial.println("No valid command found in TalkBack response");
      }

    } else {
      Serial.printf("TalkBack HTTP error: %d\n", httpCode);
    }
    http.end();
  } else {
    Serial.println("WiFi disconnected, cannot check TalkBack");
  }
}

void sendToThingSpeak(int flameValue, int mq2Value, int mq135Value, float temperature, float humidity, bool pumpOn, bool fanOn, int servoAngle) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "http://" + String(thingSpeakServer) + "/update?api_key=" + writeAPIKey;
    url += "&field1=" + String(flameValue);
    url += "&field2=" + String(mq2Value);
    url += "&field3=" + String(mq135Value);
    url += "&field4=" + String(isnan(temperature) ? 0 : temperature, 1);
    url += "&field5=" + String(isnan(humidity) ? 0 : humidity, 1);
    url += "&field6=" + String(pumpOn ? 1 : 0);
    url += "&field7=" + String(fanOn ? 1 : 0);
    url += "&field8=" + String(servoAngle);

    http.begin(url);
    int httpCode = http.GET();
    if (httpCode == HTTP_CODE_OK) {
      Serial.println("Data sent to ThingSpeak successfully");
    } else {
      Serial.printf("ThingSpeak HTTP error: %d\n", httpCode);
    }
    http.end();
  } else {
    Serial.println("WiFi disconnected, cannot send to ThingSpeak");
  }
}

// Siren function for passive buzzer
void playSiren() {
  const int highFreq = 2000;
  const int lowFreq = 1000;
  const int toneDuration = 1000;

  tone(buzzerPin, highFreq);
  delay(toneDuration);
  tone(buzzerPin, lowFreq);
  delay(toneDuration);
}

void loop() {
  // DHT Reading
  if (millis() - lastDHTRead >= dhtInterval) {
    float h = dht.readHumidity();
    float t = dht.readTemperature();
    if (!isnan(h) && !isnan(t)) {
      humidity = h;
      temperature = t;
    } else {
      Serial.println("DHT22 error: NaN");
      if (millis() - lastDHTReinit >= dhtReinitCooldown) {
        dht.begin();
        lastDHTReinit = millis();
        Serial.println("Reinitializing DHT22...");
      }
    }
    lastDHTRead = millis();
  }

  // TalkBack
  if (millis() - lastTalkBackCheck >= talkBackInterval) {
    checkTalkBack();
    lastTalkBackCheck = millis();
  }

  // Sensor readings
  int flameValue = analogRead(flamePin);
  int mq2Value = analogRead(mq2Pin);
  int mq135Value = random(280, 301); // Simulated MQ135 reading

  // Logic
  bool fireDetected = flameValue < flameThreshold;
  bool gasDetected = mq2Value > gasThreshold;
  bool pumpOn = fireDetected || gasDetected;
  digitalWrite(relayPumpPin, pumpOn ? LOW : HIGH);

  if (pumpOn) {
    playSiren();
  } else {
    noTone(buzzerPin);
  }

  // Fan control
  bool fanOn = false;
  if (!isnan(humidity) && !isnan(temperature)) {
    fanOn = (humidity > humidityThreshold) || (temperature > tempThreshold);
  }
  digitalWrite(relayFanPin, fanOn ? LOW : HIGH);

  // ThingSpeak
  if (millis() - lastThingSpeakUpdate >= thingSpeakInterval) {
    sendToThingSpeak(flameValue, mq2Value, mq135Value, temperature, humidity, pumpOn, fanOn, servoAngle);
    lastThingSpeakUpdate = millis();
  }

  // Debug output
  Serial.print("Flame: "); Serial.print(flameValue);
  Serial.print(" | MQ2: "); Serial.print(mq2Value);
  Serial.print(" | MQ135 (Sim): "); Serial.print(mq135Value);
  Serial.print(" | Temp: ");
  Serial.print(isnan(temperature) ? "NaN" : String(temperature, 1));
  Serial.print(" °C | Humidity: ");
  Serial.print(isnan(humidity) ? "NaN" : String(humidity, 1));
  Serial.print(" % | Pump: ");
  Serial.print(pumpOn ? "ON" : "OFF");
  Serial.print(" | Servo: ");
  Serial.print(servoAngle);
  Serial.print("° | Fan: ");
  Serial.println(fanOn ? "ON" : "OFF");

  delay(500);
}
