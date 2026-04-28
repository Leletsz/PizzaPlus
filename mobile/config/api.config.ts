import Constants from "expo-constants";

// Pega o host do servidor Expo (ex: "192.168.0.18:8081") e usa o mesmo IP para o backend
const expoHost = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";

export const API_CONFIG = {
    BASE_URL: `http://${expoHost}:3333`, // sempre usa o IP atual da máquina automaticamente
    TIMEOUT: 12000, //12 segundos
}