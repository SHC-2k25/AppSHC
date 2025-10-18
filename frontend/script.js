// Produção (site HTTPS): "wss://SEU_BACKEND/?from=site"
// Dev local:             "ws://localhost:8080/?from=site"
const ENDERECO_WS = "wss://tcc-backend-silk.vercel.app/?from=site"

let conexaoWs

function conectar() {
    conexaoWs = new WebSocket(ENDERECO_WS)

    conexaoWs.onopen = () => {
        console.log("Conectado ao backend")
    }

    conexaoWs.onerror = () => {
        console.log("Erro na conexão")
    }

    conexaoWs.onclose = () => { 
        console.log("Conexão fechada, tentando reconectar...")
        setTimeout(conectar, 1200) 
    }

    conexaoWs.onmessage = (evento) => {
        console.log("Mensagem recebida:", evento.data)
        try {
            const dados = JSON.parse(evento.data)

            // Se o ESP32 mandar {"piscada": true}
            if (dados.piscada === true) {
                // No index.html existe handleTrigger()
                if (typeof handleTrigger === "function") {
                    handleTrigger()
                }
                // Nas páginas de escolha (emoji, substantivo etc.) existe tentarAdicionar()
                else if (typeof tentarAdicionar === "function") {
                    window.piscada = true
                    tentarAdicionar()
                }
            }
        } catch {
            console.log("Mensagem não era JSON válido")
        }
    }
}

conectar()