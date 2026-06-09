const UI = class{

    constructor(){
        this.interval = {
            update      : null,
        };
        this.timer    = {
            blink       : { current: 0, max: 120 },
        };
        this.countdown = {
            emotion     : { current: 0, count: 60 , callback: null,},
        };
        this.node = { 
            content     : document.querySelector('.content'), 
            avatar      : {
                background  : document.querySelector('.left'), 
                face        : document.querySelector('.left span'),
                eyes        : document.querySelector('.left span + span'),
            },
            mind        : document.querySelector('.right'),
            input       : document.querySelector('.footer')
        };
        this.interval.update = setInterval( UIUpdate, 30);
    }

    debug( text , type=''){
        const txt = document.createElement('div');
        txt.className = `message ${type}`;
        txt.textContent = text;
        this.node.mind.appendChild(txt);
        this.node.mind.scrollTop = this.node.mind.scrollHeight;
    }

    print(text, type='system'){
        const txt = document.createElement('div');
        txt.className = `message ${type}`;
        txt.textContent = text;
        this.node.content.appendChild(txt);
        this.node.content.scrollTop = this.node.content.scrollHeight;
    }
 
    inject( html ){
        this.node.content.innerHTML = this.node.content.innerHTML + html;
        this.node.content.scrollTop = this.node.content.scrollHeight;
    }

    setBackground( classname ){
        this.node.avatar.background.setAttribute('aria-status', classname);
    }

    setCountdown( countdown_key, callback=function(){} ){
        this.countdown[countdown_key].callback = callback;
        this.countdown[countdown_key].current = this.countdown[countdown_key].count;
    }
    
    updateTimers(){
        for(var timer in this.timer){
            if( this.timer[timer].current < this.timer[timer].max ) 
                this.timer[timer].current++;
            else
                this.timer[timer].current=0;
        }
        for(var countdown in this.countdown){
            if( this.countdown[countdown].current > 0)  
                this.countdown[countdown].current--;
            else if(this.countdown[countdown].callback){
                this.countdown[countdown].callback();
                this.countdown[countdown].callback=null;
            }
        }
    }

    lock(){
        this.node.input.value = '';        
        // Bloquear el input mientras se procesa la solicitud
        this.node.input.disabled = true;
        this.node.input.placeholder = "Esperando respuesta...";
    }

    unlock(){
        this.node.input.disabled = false;
        this.node.input.placeholder = "";
        this.node.input.focus(); // Devolver el foco al cuadro de texto
        /* Elimina mensajes temporales */
        document.querySelectorAll('.temporary').forEach((o)=>{ o.remove(); });
    }

    update(){
        this.updateTimers();
        adam.update();
    }

};

function UIUpdate(){
    ui.update();
}