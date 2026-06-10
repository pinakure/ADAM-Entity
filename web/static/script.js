const ui = new UI();
const adam = new Adam('smiker');

adam.initialize();

ui.node.input.focus();
ui.node.content.addEventListener('click', function(){ ui.node.input.focus(); });
ui.node.input.addEventListener('keydown', async function(event) {
    // 1. Detectar si se pulsa Enter y asegurar que el texto no esté vacío ni sean solo espacios
    this.value = emoji2ascii(this.value);
    if (event.key === 'Enter' && this.value.trim() !== '') {
        const prompt = this.value.trim();
        if(prompt[0]=='/') return adam.handleCommand(prompt);
        ui.lock();
        ui.print(prompt, 'user');
        try {
            ui.print("Thinking", 'temporary');
            const reply = await adam.think( prompt ); 
            document.querySelectorAll('.temporary').forEach((e) => { e.remove() });
            ui.print("Pronnouncing", 'temporary');
            await adam.say( reply );
        } catch (error) {
            ui.debug(error, 'error');
            ui.print(error, 'error');
        } finally {
            adam.setState( State.IDLE );
            ui.unlock();
        }
    }
});

// Función auxiliar necesaria en Django para obtener el token CSRF desde las cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
