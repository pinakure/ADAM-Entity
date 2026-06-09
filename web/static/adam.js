
const Adam = class{
    constructor( name ){
        this.name       = name;
        this.phonem     = Phonem.M;
        this.state      = null;
        this.emotion    = null;
        this.face       = null;
        this.blink      = false;
        this.timer      = { enabled: false, value:0, subject:'' };
        this.model      = null;
        this.tokens     = [];
        this.setModel( 'ryukk:latest' );
        this.setModel( 'llama3' );
        this.setState( State.IDLE );
        this.enqueueText( "Hola, soy Adam-01, estoy aqui para darte respuestas a preguntas que todavía no sabes que tienes.");
        ui.debug(`Token Queue Size: ${this.countTokens()}`);
    }
    
    setModel( model ){
        this.model = model;        
        ui.node.avatar.model.innerHTML = this.model;
    }

    handleCommand(command){
        switch(command.toLowerCase()){
            case '/smile':  return this.setEmotion( Emotion.SATISFACTION );
            case '/love':   return this.setEmotion( Emotion.LOVE );
            case '/cry':    return this.setEmotion( Emotion.SADNESS );
            case '/sleep':  return this.setState( State.SLEEPING );
            default:
                return null;
        }
    }

    countTokens(){
        return this.tokens.length;
    }

    enqueueText( text ){
        // split in tokens
        this.tokens = text.split(' ');
    }

    enqueueToken( word ){
        this.tokens.shift( word );
    }

    consumeToken(){
        if(this.tokens.length==0)return null;
        return this.tokens.pop();
    }

    setEmotion( emotion ){
        // ui.debug(`setEmotion(${emotion})`);
        this.emotion = emotion;
        ui.node.avatar.face.setAttribute('aria-emotion', this.emotion);

        switch( this.emotion ){
            case Emotion.NEUTRAL:
                this.setFace( Face.IDLE );
                return ui.setCountdown('emotion', null);

            case Emotion.SADNESS:
                this.setFace( Face.CRY );
                break;

            case Emotion.LOVE:
                this.setFace( Face.LOVE );
                break;

            case Emotion.SATISFACTION:
                this.setFace( Face.SMILE );
                break;
        }
        /* Switch Automatically to Emotion.NEUTRAL when ui.countdown.emotion.current is 0 */
        if(this.emotion != Emotion.NEUTRAL)
            ui.setCountdown('emotion', function(){ adam.setEmotion( Emotion.NEUTRAL ); });
    }

    setState( state ){
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
        this.face = face;
        ui.node.avatar.face.setAttribute('aria-face'  , this.face);
    }

    startTimer( subject='' ){
        // ui.debug(`Started ${ subject }...`);
        this.timer.subject = subject;
        this.timer.enabled = true;
        this.timer.value   = 0;
    }

    updateTimer(){
        this.timer.value  += this.timer.enabled ? 30 : 0;
    }

    stopTimer(){
        var magnitude = this.timer.value > 999 ? 'seconds' : 'ms';
        ui.debug(`Finished ${ this.timer.subject } in ${magnitude == 'seconds' ? this.timer.value / 1000 : this.timer.value} ${ magnitude }.`);
        this.timer.enabled = false;
    }

    async think( prompt ){
        adam.setState( State.THINKING );
        adam.startTimer('thinking');
        // Enviar la petición con el texto introducido a LLM
        const response = await fetch('https://ollama.iskarion.ddns.net/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt  : prompt,
                model   : adam.model,
                stream  : false
            })
        });
        if (!response.ok) {
            adam.stopTimer();
            throw new Error((await response.json()).error);
        }
        const data = await response.json();
        adam.stopTimer();
        return data.response;
    }

    async say( text ){
        adam.setState( State.TALKING );
        adam.startTimer('pronnouncing');
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
        audio.setAttribute('controls', true);
        ui.node.content.append(audio);
        audio.play();
        audio.addEventListener('stop', function(){ ui.debug('Audio has been stopped.');});
        adam.stopTimer();
    }

    update() {
        ui.node.avatar.face.setAttribute('aria-blink'   , ui.timer.blink.current >= ui.timer.blink.max - 5);
        adam.updateTimer();
    }
};
