const UI = class{

    constructor(){
        this.interval = {
            update      : null,
        };
        this.timer    = {
            blink       : { current: 0, max: 120 },
        };
        this.node = { 
            content     : document.querySelector('.content'), 
            avatar      : {
                bg : document.querySelector('.left'), 
                fg : document.querySelector('.left span'),
            },
            mind        : document.querySelector('.right'),
            input       : document.querySelector('.footer')
        };
        this.interval.update = setInterval( UIUpdate, 30);
    }

    print(text, type='system'){
        const txt = document.createElement('div');
        txt.className = `message ${type}`;
        txt.textContent = text;
        this.node.content.appendChild(txt);
        this.node.content.scrollTop = this.node.content.scrollHeight;
    }

    setBackground( classname ){
        this.node.avatar.bg.setAttribute('aria-status', classname);
    }
    
    setForeground( classname ){
        this.node.avatar.fg.setAttribute('aria-status', classname);
    }

    updateTimers(){
        for(var timer in this.timer){
            if( this.timer[timer].current < this.timer[timer].max ) 
                this.timer[timer].current++;
            else
                this.timer[timer].current=0;
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
    }

    update(){
        this.updateTimers();
        this.node.avatar.fg.setAttribute('aria-blink', this.timer.blink.current > this.timer.blink.max-5);
    }

};

function UIUpdate(){
    ui.update();
}