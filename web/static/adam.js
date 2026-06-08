const Adam = class{
    constructor( name ){
        this.name   = name;
        this.phonem = null;
    }

    setFace( type ){
        ui.setForeground(type);
    }

    async think( prompt ){
        ui.setBackground('thinking');
        this.setFace('thinking');
        
        // Enviar la petición con el texto introducido a LLM
        const response = await fetch('https://ollama.iskarion.ddns.net/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                prompt: prompt,
                model: "gemma4",
                stream: false
            })
        });
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        const data = await response.json();
        return data.response; 
    }

    idle(){
        this.setFace('idle');
        ui.setBackground('static');
    }

    async say( text ){
        ui.print( text , 'bot');
        await this.talk(text);
    }

    async talk( text ){
        // Enviar a endpoint TTS para descargar y reproducir el audio MP3
        const audioResponse = await fetch('https://tts.iskarion.ddns.net/v1/text-to-speech/davefx-es', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                text: text 
            })
        });
        if (!audioResponse.ok) throw new Error('Error al descargar el audio');
        const audioBlob = await audioResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        console.log(audio);            
        audio.play();
    }
};
