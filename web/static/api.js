class AdamAPI {
    constructor( parent ){
        this.parent = parent;
    }

    csrf() {
        const nombre = 'csrftoken=';
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i].trim();
            if (c.indexOf(nombre) === 0) {
                return decodeURIComponent(c.substring(nombre.length));
            }
        }
        return '';
    }

    // Enviar la petición con el texto introducido a LLM
    async think( prompt ){
        this.parent.startTimer('thinking');
        const response = await fetch('https://ollama.iskarion.ddns.net/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt  : prompt,
                model   : this.parent.model,
                stream  : false
            })
        });
        if (!response.ok) return await this.parent.error(response);
        const data = (await response.json()).response;
        this.parent.stopTimer();
        return data;
    }
    
    // Enviar a endpoint TTS para descargar y reproducir el audio MP3
    async pronounce( text ){
        this.parent.startTimer('pronouncing');
        const audioResponse = await fetch('https://tts.iskarion.ddns.net/v1/text-to-speech/davefx-es', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: `${text}`,
            })
        });
        if (!audioResponse.ok) return await this.parent.error(audioResponse);
        const audioBlob = await audioResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        this.parent.stopTimer();
        return audio; 
    }
    
    // Enviar a backend para separar emojis y cadenas de texto, y limpiar caracteres no legibles
    async tokenize( text ) {
        if (!text.trim()) {
            console.warn("El texto está vacío.");
            return null;
        }
        try {
            const respuesta = await fetch('/tokenize/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.csrf() 
                },
                body: JSON.stringify({ text: text }) 
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(datos.error || 'Error en el servidor');
            }
            return datos;
        } catch (error) {
            console.error('Error al procesar la tokenización:', error);
            alert('Hubo un problema: ' + error.message);
            return null;
        }
    }
};