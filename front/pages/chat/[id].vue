<script setup lang="ts">
interface IMessage extends IMessageSend {
  _id: string;
}

interface IMessageSend {
  idIssue: string;
  idSender: string;
  idReceiver: string;
  title?: string;
  content: string;
}

enum Status {
  OPEN = "open",
  CANCELED = "canceled",
  BOOKED = "booked",
  CLOSED = "closed",
}

interface ITechnology {
  _id: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IIssue {
  idUser: string;
  idMentor: string;
  createdAt?: Date;
  updatedAt?: Date;
  likeScore?: number;
  title?: string;
  description?: string;
  status: Status;
  technologies?: ITechnology[];
  visioLink?: string;
  bookingDate?: Date;
  bookingDuration?: number;
  passedDuration?: number;
  messages: IMessage[];
}

definePageMeta({
  layout: "landing",
});

const ws = ref<WebSocket | null>(null);
const messages = ref<IMessage[]>([]);
const newMessage = ref("");
const route = useRoute();
const idIssue = route.params.id as string;
const issue = ref<IIssue | null>(null);
const loading = ref<boolean>(true);
const userStore = useUserStore();

const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    const message: IMessageSend = {
      idIssue,
      idSender: userStore.userRef!.id,
      idReceiver:
        issue.value!.idMentor === userStore.userRef?.id
          ? issue.value!.idUser
          : issue.value!.idMentor,
      content: newMessage.value,
    };

    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(message));
      newMessage.value = "";
    }
  }
};

onMounted(async () => {
  // Get issue
  try {
    const response = await fetch(
      "http://localhost:3000/api/issues/" + idIssue,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userStore.tokenRef}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      issue.value = data;
    } else {
      return navigateTo("/login");
    }
  } catch (error) {
    console.error(error);
  }
  // Get messages history
  try {
    const response = await fetch(
      `http://localhost:3000/api/issues/${idIssue}/messages`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userStore.tokenRef}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      messages.value = data;
    } else {
      return navigateTo("/login");
    }
  } catch (error) {
    console.error(error);
  }
  loading.value = false;

  ws.value = new WebSocket("ws://localhost:3000");
  ws.value.onmessage = (event) => {
    console.info("message received");

    if (event.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const blobText = reader.result as string;
          const message = JSON.parse(blobText);
          messages.value = [...messages.value, message];
          console.log(message);
        } catch (error) {
          console.error("Error parsing Blob content:", error);
        }
      };
      reader.readAsText(event.data);
    } else {
      console.warn("Received unexpected message type:", typeof event.data);
    }
  };

  ws.value.onopen = () => {
    console.log("Connected to WebSocket server");
  };

  ws.value.onclose = () => {
    console.log("Disconnected from WebSocket server");
  };
});
</script>

<template>
  <LandingContainer class="w-3/4">
    <LandingSectionhead>
      <template v-slot:title>Chat</template>
      <template v-slot:desc>&nbsp;</template>
    </LandingSectionhead>
    <LandingLink href="/visio" styleName="primary">Entrer en visio</LandingLink>
    <div v-if="loading" class="flex justify-center items-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-else class="h-screen flex flex-col mt-4">
      <div class="bg-gray-200 flex-1 overflow-y-scroll">
          <div class="px-4 py-2">
            <div v-for="message in messages" :key="message._id">
              <div v-if="message.idSender === userStore.userRef?.id" class="flex items-center justify-end mb-2">
                  <div class="bg-blue-500 text-white rounded-lg p-2 shadow max-w-sm">
                    {{ message.content }}
                  </div>
              </div>
              <div v-else class="flex items-center mb-2">
                <div class="bg-white rounded-lg p-2 shadow max-w-sm">
                  {{ message.content }}
                </div>
              </div>
            </div>
          </div>
      </div>
      <div class="bg-gray-100 px-4 py-2">
        <form @submit.prevent="sendMessage" class="flex items-center">
          <input v-model="newMessage" class="w-full border rounded-full py-2 px-4 mr-2" type="text" placeholder="Type your message...">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full" type="submit">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  </LandingContainer>
</template>
