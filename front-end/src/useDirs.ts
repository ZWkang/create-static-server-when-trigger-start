import { ref } from 'vue';

export const data = ref({
  files: [],

  lastPathChange: '',
})

async function getDirs() {
  const result = await fetch('/api/payload.json');
  const payload = await result.json();
  return payload;
}

const ws = new WebSocket(`ws://${location.hostname}:7811`)

ws.addEventListener('message', async (event) => {
  console.log('WebSocket message', event.data)
  const payload = JSON.parse(event.data)
  if (payload.type === 'config-change'){
    data.value.lastPathChange = payload.path;
    const res = await getDirs();
    data.value.files = res.files;
  }
})

function init() {
  getDirs().then(res => {
    data.value.files = res.files;
  })
}

init();
