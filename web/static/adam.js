/*
    -----------------------------------------------------------------
    Project Start @ 20260707
    Pinakure AKA Smiker
    All Rights Reserved
    -----------------------------------------------------------------
*/
const Adam = class{
    constructor( name ){
        this.name       = name;
        this.phonem     = Phonem.M;
        this.state      = null;
        this.emotion    = null;
        this.face       = null;
        this.blink      = false;
        this.typewriter = { timer: 0, length: 0, quantum: 0 };
        this.timer      = { enabled: false, value:0, subject:'' };
        this.model      = null;
        this.token      = null;
        this.tokens     = [];
        this.api        = new AdamAPI( this );

    }

    async initialize(){
        this.setModel( 'ryukk:latest' );
        this.setModel( 'llama3' );
        this.setState( State.IDLE );
        await this.say( "Hola! 😃, mi nombre es Adam Uno.");
        await this.say( "Listo para operar.");
    }

    /*  -------------------------------------------------------------
                            INTERFACE / SETTERS
    //  -----------------------------------------------------------*/

    setModel( model ){
        this.model = model;
        ui.node.avatar.model.innerHTML = this.model;
    }

    setEmotion( emotion ){
        // ui.debug(`setEmotion(${emotion})`);
        this.emotion = emotion;
        ui.node.emotion.innerHTML = this.emotion;
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
        /*
            Switch Automatically to Emotion.NEUTRAL
            when ui.countdown.emotion.current is 0
        */
        if(this.emotion != Emotion.NEUTRAL)
            ui.setCountdown('emotion', this.neutral);
    }

    setState( state ){
        this.state = state;
        ui.node.state.innerHTML = this.state;
        ui.node.avatar.face.setAttribute('aria-status', this.state);

        switch( this.state ){
            case State.IDLE:
                this.neutral();
                ui.setBackground('static');
                break;
            case State.THINKING:
                this.neutral();
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

    stopTimer(){
        const subject = this.timer.subject;
        const magnitude = (this.timer.value) > 999 ? 'seconds'
                                                   : 'ms';
        const value =parseFloat(
            (magnitude=='seconds') ? this.timer.value*.001
                                   : this.timer.value
        );
        ui.debug(`Finished ${ subject } in ${value} ${magnitude}.`);
        this.timer.enabled = false;
    }

    /*  -------------------------------------------------------------
                            ADAM SHORTCUTS
    //  -----------------------------------------------------------*/

    idle()          { adam.setState( State.IDLE );}
    neutral()       { adam.setEmotion( Emotion.NEUTRAL );}
    info(text)      { ui.node.info.innerHTML = text; }

    /*  -------------------------------------------------------------
                          ASYNC / API CALLS
    //  -----------------------------------------------------------*/

    async error( error ){
        adam.stopTimer();
        throw new Error((await error.json()).error);
        return null;
    }

    async think( prompt ){
        this.setState( State.THINKING );
        const response = await this.api.think( prompt );
        return response;
    }

    async say( text ){
        this.startTimer('parsing');
        const response  = await this.api.tokenize(text);
        const data      = await (response);
        this.tokens     = this.tokens.concat( data.tokens );
        ui.debug(`Enqueued ${ this.tokens.length } tokens.`);
        this.stopTimer();
    }

    async talk( text ){
        this.setState( State.TALKING );
        ui.print( text, 'bot');
        const audio = await this.api.pronounce( text );
        // audio.setAttribute('controls', true);
        ui.node.content.append(audio);
        audio.addEventListener('loadedmetadata', (evt) => {
            const obj = evt.target;
            obj.setAttribute('duration', obj.duration);
            obj.play();
            adam.token.audio = obj;
            adam.typewriter.length  = adam.token.value.length;
            adam.typewriter.timer   = 0;
            adam.typewriter.quantum = adam.token.audio.duration / adam.typewriter.length;        
            obj.addEventListener('ended', adam.idle);
        });
    }

    /*  -------------------------------------------------------------
                               SPEECH
    //  -----------------------------------------------------------*/
    consumeToken(){
        return (this.tokens.length==0)?null:this.tokens.splice(0,1);
    }
    express( emoji ){
        switch(emoji){
            case '😀': case '😃': case '😊': case '😊':
                return this.setEmotion( Emotion.SATISFACTION );
            case '😥':
                return this.setEmotion( Emotion.SADNESS );
            case '😍':case '😘':case '🥰':
                return this.setEmotion( Emotion.LOVE );
            default: return ui.debug(`EMOJI: ${emoji}`);
        }
    }
    /*  -------------------------------------------------------------
                           GLOBAL UPDATE
    //  -----------------------------------------------------------*/
    updateTimer(){ this.timer.value += this.timer.enabled ? 30 : 0;}
    updateTypewriter(){ 
        if(!this.token)return;
        this.typewriter.timer += this.typewriter.quantum;
        if(this.typewriter.timer >= this.typewriter.length ){
            // this.token = null;
            this.typewriter.timer = 0;
            this.typewriter.length = 0;
        }
    }

    async updateSpeech(){
        const is_token = this.consumeToken();
        if(!is_token){
            this.token = null;
            // this.setState( State.IDLE );
            return null; 
        }
        ui.debug("1 Token Consumed");
        const token = is_token[0];
        this.token = token;
        if( token.type=='emoji') {
            this.express( token.value );
        } else {
            await this.talk( token.value );
        }
    }

    update() {
        ui.node.avatar.face.setAttribute(
            'aria-blink',
            ui.timer.blink.current >= ui.timer.blink.max - 5
        );
        var tokens = [];
        adam.tokens.forEach(token => {
            tokens.push(token.value);
        });
        
        adam.info(adam.token && adam.token.audio ? `
            AUDIO LEN: ${ adam.token.audio.duration } <br/> 
            TOKEN LEN: ${ adam.typewriter.length } <br/> 
            T.QUANTUM: ${ adam.typewriter.quantum } <br/>
            T.W.TIMER: ${ adam.typewriter.timer } <br/>
        ` : '');

        // debugger
        if( adam.state == State.IDLE
        &&  adam.emotion == Emotion.NEUTRAL ){
            adam.updateSpeech();
        }
        adam.updateTimer();
        adam.updateTypewriter();
    }

    /*  -------------------------------------------------------------
                          COMMAND HANDLER
    //  -----------------------------------------------------------*/

    handleCommand(command){
        ui.node.input.value='';
        switch(command.toLowerCase()){
            case '/talk':   return this.setState( State.TALKING );
            case '/smile':  return this.setEmotion( Emotion.SATISFACTION );
            case '/love':   return this.setEmotion( Emotion.LOVE );
            case '/cry':    return this.setEmotion( Emotion.SADNESS );
            case '/sleep':  return this.setState( State.SLEEPING );
            default:
                return null;
        }
    }

};
