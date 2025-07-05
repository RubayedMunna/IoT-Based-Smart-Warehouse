# 🏭✨ Smart Warehouse System | IoT Project

> 🎯 **Objective**: A real-time, sensor-powered smart warehouse system designed to monitor environmental hazards and trigger automated safety actions using the Internet of Things (IoT).

---

## 🔍 Overview

A fully integrated system that monitors **gas**, **smoke**, **flame**, **temperature**, and **humidity** to ensure warehouse safety. It triggers **alerts**, controls **servo doors**, and sends data to **ThingSpeak** for live cloud monitoring.

> 🚨 Built to act *before* disaster strikes — smart, fast, and fully automated.

---

## ⚙️ Tech Stack & Components

| Component      | Description                                    |
|----------------|------------------------------------------------|
| 🧪 **Sensors**     | MQ135, MQ2, Flame Sensor, DHT22              |
| 🧠 **Microcontroller** | ESP32 Wi-Fi Module                         |
| 📡 **Platform**     | [ThingSpeak](https://thingspeak.com) for live monitoring |
| 🔔 **Actuators**     | Buzzers, Servo-controlled doors             |
| 🧰 **Tools**        | Arduino IDE, GitHub                         |

---

## 🖥️ How to Set Up the Smart Warehouse System (Windows)

Follow the steps below to set up and run this project on a **Windows machine** using **Arduino IDE** and an **ESP32 board**.

---

### 📂 1. Clone This Repository

Open **Git Bash**, **CMD**, or **PowerShell**, then run:

```bash
git clone https://github.com/your-username/smart-warehouse-system.git
cd smart-warehouse-system
```
### ⚙️ 2. Install the ESP32 Board in Arduino IDE

1. **Open Arduino IDE**
2. Go to **File → Preferences**
3. In the **"Additional Board Manager URLs"** field, paste the following URL:

   ```text
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Click OK to save.

5. Go to Tools → Board → Boards Manager

6. Search for: ESP32 by Espressif Systems

7. Click Install

 ### 🔌 3. Open and Upload the Code

1. **Connect your ESP32** to your PC via USB

2. Open **Arduino IDE** and follow these steps:

   - Go to `File → Open`  
     ➤ Open the `.ino` file from the cloned repository

   - Go to `Tools` and configure:
     - **Board**: Select your ESP32 board (e.g., `ESP32 Dev Module`)
     - **Port**: Select the correct **COM port**

3. Click the ✅ **Upload** button to flash the code onto your ESP32

### 🌐 **4. Connect to ThingSpeak**

1. Go to [ThingSpeak.com](https://thingspeak.com) and create a free account.

2. Create a new channel.

3. Copy your Write API Key.

4. In the code, update the following lines with your Wi-Fi and API credentials:

```cpp
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
String apiKey = "YOUR_THINGSPEAK_API_KEY";
Save and upload the code again to your ESP32.

```

