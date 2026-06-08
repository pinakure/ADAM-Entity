
const Adam = class{
    constructor( name ){
        this.name       = name;
        this.phonem     = Phonem.M;
        this.state      = null;
        this.emotion    = null;
        this.face       = null;
        this.blink      = false;
        this.setState( State.IDLE );
    }

    setEmotion( emotion ){
        ui.debug(`setEmotion(${emotion})`);
        this.emotion = emotion;
        ui.node.avatar.face.setAttribute('aria-emotion', this.emotion);

        switch( this.emotion ){
            case Emotion.NEUTRAL:
                this.setFace( Face.IDLE );
                break;
            case Emotion.SADNESS:
                this.setFace( Face.IDLE );
                break;
            case Emotion.SATISFACTION:
                this.setFace( Face.SMILE );
                break;
        }
    }

    setState( state ){
        ui.debug(`setState(${state})`);
        this.state = state;        
        ui.node.avatar.face.setAttribute('aria-status', this.state);

        switch( this.state ){
            case State.IDLE:
                this.setEmotion( Emotion.NEUTRAL );
                ui.setBackground('static');
                break;
            case State.THINKING:                
                this.setEmotion( Emotion.NEUTRAL );
                ui.setBackground('thinking');
                break;
            case State.TALKING:
                break;
            case State.SLEEPING:
                this.setFace( Face.SLEEPING );
                break;
            case State.EXPRESSING:
                break;
            default:
                return this.setState( State.IDLE );
        }
    }

    setFace( face ){
        ui.debug(`setFace(${face})`);
        this.face = face;
        ui.node.avatar.face.setAttribute('aria-face'  , this.face);
    }

    async think( prompt ){
        ui.debug(`think(...)`);
        adam.setState( State.THINKING );
        
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

    async say( text ){
        ui.debug(`say(...)`);        
        adam.setState( State.TALKING );
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
                text: `${text}`, 
            })
        });
        if (!audioResponse.ok) throw new Error('Error al descargar el audio');
        const audioBlob = await audioResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        console.log(audio);            
        audio.play();
    }

    update() {
        ui.node.avatar.face.setAttribute('aria-blink'   , ui.timer.blink.current >= ui.timer.blink.max - 5);
    }
};
