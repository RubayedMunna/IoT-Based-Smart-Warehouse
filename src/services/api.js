const channelId = '2968873';
const readApiKey = 'ID3RHY8FE9VFNGQF';
const talkBackId = '54806';
const talkBackApiKey = '37XIT8J7J51VN4CO';

export const fetchThingSpeakData = async () => {
  const response = await fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&results=1`);
  if (!response.ok) throw new Error('Fetch failed');
  const { feeds } = await response.json();
  const f = feeds[0];
  return {
    flame: parseInt(f.field1) || 0,
    mq2: parseInt(f.field2) || 0,
    mq135: parseInt(f.field3) || 0,
    temperature: parseFloat(f.field4) || 0,
    humidity: parseFloat(f.field5) || 0,
    pump: parseInt(f.field6) || 0,
    fan: parseInt(f.field7) || 0,
    servo: parseInt(f.field8) || 0,
  };
};

export const fetchTalkBackQueue = async () => {
  const response = await fetch(`https://api.thingspeak.com/talkbacks/${talkBackId}/commands.json?api_key=${talkBackApiKey}`);
  if (!response.ok) throw new Error('TalkBack queue error');
  return response.json();
};

export const sendTalkBackCommand = async (command) => {
  const response = await fetch(`https://api.thingspeak.com/talkbacks/${talkBackId}/commands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: talkBackApiKey, command_string: command, position: 1 }),
  });
  if (!response.ok) throw new Error('TalkBack command error');
  return response.json();
};
