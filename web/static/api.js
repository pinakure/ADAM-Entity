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

    // Enviar a backend para separar emojis y cadenas de texto, y limpiar caracteres no legibles
    async tokenize( text ) {
        if (!text.trim()) {
            console.warn("El texto está vacío.");
            return null;
        }
        try {
            const respuesta = await fetch('/tokenize/', {
                method  : 'POST',
                headers : {
                    'Content-Type'  : 'application/json',
                    'X-CSRFToken'   : this.csrf() 
                },
                body    : JSON.stringify({ 
                    text    : text 
                }) 
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
    
    // Enviar la petición con el texto introducido a LLM
    async think( messages ){
        this.parent.startTimer('thinking');
        const response = await fetch('/think/', {
            method: 'POST',
            headers: {
                'Content-Type'  : 'application/json',
                'X-CSRFToken'   : this.csrf() 
            },
            body: JSON.stringify({
                messages    : messages,
                model       : this.parent.model,
            })
        });
        if (!response.ok) return await this.parent.error(response);
        const data = (await response.json());
        this.parent.stopTimer();
        return { response : data.message.content };
    }
    
    // Enviar la petición con el texto introducido a modelo de difusión
    async imagine( prompt ){
        this.parent.startTimer('thinking');
        const response = await fetch('/imagine/', {
            method: 'POST',
            headers: {
                'Content-Type'  : 'application/json',
                'X-CSRFToken'   : this.csrf() 
            },
            body: JSON.stringify({
                prompt  : prompt,
            })
        });
        
        if (!response.ok) return await this.parent.error(response);
        const data = (await response.json())
        const payload = data.response;
        this.parent.stopTimer();
        /*
        
        POST /prompt
        URL: http://127.0.0
        Uso: Envia el JSON con tu flujo de trabajo a la cola de renderizado.Retorna: Un prompt_id único para rastrear la tarea.
        
        GET /history
        URL: http://127.0.0 o http://127.0.0{prompt_id}
        Uso: Obtiene el historial de generaciones pasadas o el resultado de una tarea específica mediante su ID.
        
        {
            "78c8a17c-abf6-48bc-b3b1-469a6378d953": {
                "prompt": [0, "78c8a17c-abf6-48bc-b3b1-469a6378d953",
                {
                    "9": {
                    "inputs": {
                        "filename_prefix": "z-image-turbo",
                        "images": [
                        "57:8",
                        0]
                    },
                    "class_type": "SaveImage",
                    "_meta": {
                        "title": "Guardar Imagen"
                    }
                    },
                    "57:30": {
                    "inputs": {
                        "clip_name": "qwen_3_4b.safetensors",
                        "type": "lumina2",
                        "device": "default"
                    },
                    "class_type": "CLIPLoader",
                    "_meta": {
                        "title": "Cargar CLIP"
                    }
                    },
                    "57:29": {
                    "inputs": {
                        "vae_name": "ae.safetensors"
                    },
                    "class_type": "VAELoader",
                    "_meta": {
                        "title": "Cargar VAE"
                    }
                    },
                    "57:33": {
                    "inputs": {
                        "conditioning": [
                        "57:27",
                        0]
                    },
                    "class_type": "ConditioningZeroOut",
                    "_meta": {
                        "title": "Acondicionamiento Cero"
                    }
                    },
                    "57:8": {
                    "inputs": {
                        "samples": [
                        "57:3",
                        0],
                        "vae": [
                        "57:29",
                        0]
                    },
                    "class_type": "VAEDecode",
                    "_meta": {
                        "title": "Decodificación VAE"
                    }
                    },
                    "57:28": {
                    "inputs": {
                        "unet_name": "z_image_turbo_bf16.safetensors",
                        "weight_dtype": "default"
                    },
                    "class_type": "UNETLoader",
                    "_meta": {
                        "title": "Cargar Modelo de Difusión"
                    }
                    },
                    "57:27": {
                    "inputs": {
                        "text": "an apple",
                        "clip": [
                        "57:30",
                        0]
                    },
                    "class_type": "CLIPTextEncode",
                    "_meta": {
                        "title": "Codificar Texto CLIP (Prompt)"
                    }
                    },
                    "57:13": {
                    "inputs": {
                        "width": 1024,
                        "height": 1024,
                        "batch_size": 1
                    },
                    "class_type": "EmptySD3LatentImage",
                    "_meta": {
                        "title": "EmptySD3LatentImage"
                    }
                    },
                    "57:11": {
                    "inputs": {
                        "shift": 3,
                        "model": [
                        "57:28",
                        0]
                    },
                    "class_type": "ModelSamplingAuraFlow",
                    "_meta": {
                        "title": "ModelSamplingAuraFlow"
                    }
                    },
                    "57:3": {
                    "inputs": {
                        "seed": 0,
                        "steps": 8,
                        "cfg": 1,
                        "sampler_name": "res_multistep",
                        "scheduler": "simple",
                        "denoise": 1,
                        "model": [
                        "57:11",
                        0],
                        "positive": [
                        "57:27",
                        0],
                        "negative": [
                        "57:33",
                        0],
                        "latent_image": [
                        "57:13",
                        0]
                    },
                    "class_type": "KSampler",
                    "_meta": {
                        "title": "KSampler"
                    }
                    }
                },
                {
                    "create_time": 1781506293942
                },
                [
                    "9"
                ]
                ],
                "outputs": {
                "9": {
                    "images": [
                    {
                        "filename": "z-image-turbo_00002_.png",
                        "subfolder": "",
                        "type": "output"
                    }
                    ]
                }
                },
                "status": {
                "status_str": "success",
                "completed": true,
                "messages": [
                    [
                    "execution_start",
                    {
                        "prompt_id": "78c8a17c-abf6-48bc-b3b1-469a6378d953",
                        "timestamp": 1781506293943
                    }
                    ],
                    [
                    "execution_cached",
                    {
                        "nodes": [],
                        "prompt_id": "78c8a17c-abf6-48bc-b3b1-469a6378d953",
                        "timestamp": 1781506293948
                    }
                    ],
                    [
                    "execution_success",
                    {
                        "prompt_id": "78c8a17c-abf6-48bc-b3b1-469a6378d953",
                        "timestamp": 1781506500379
                    }
                    ]
                ]
                },
                "meta ": {
                "9": {
                    "node_id": "9",
                    "display_node": "9",
                    "parent_node": null,
                    "real_node_id": "9"
                }
                }
            }
        }

        GET /viewURL: http://127.0.0{nombre}&type=output
        Uso: Descarga la imagen final que ya se ha generado y guardado en la carpeta output.
        
            http://crebelux.com:8188/api/view?filename=z-image-turbo_00002_.png&type=output&subfolder=

        POST /upload/imageURL: http://127.0.0
        Uso: Sube imágenes desde tu código a ComfyUI (útil para flujos de Img2Img o ControlNet).
        
        WS /ws
        URL: ws://127.0.0.1:8188/ws?clientId={id_unico}
        Uso: Abre una conexión WebSocket para escuchar el progreso en tiempo real (% de renderizado).
        Si ejecutas ComfyUI en un servidor remoto o en la nube (como RunPod o Vast.ai), 
        simplemente debes reemplazar 127.0.0.1:8188 por la IP pública o el dominio que te asigne tu proveedor.

        */
        return payload;
    }
    
    // Enviar a endpoint TTS para descargar y reproducir el audio MP3
    async pronounce( text ){
        this.parent.startTimer('pronouncing');
        const audioResponse = await fetch('/pronounce/', {
            method: 'POST',
            headers: {
                'Content-Type'  : 'application/json',
                'X-CSRFToken'   : this.csrf() 
            },
            body: JSON.stringify({
                text    : text,
            })
        });
        if (!audioResponse.ok) return await this.parent.error(audioResponse);
        const audioBlob = await audioResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        this.parent.stopTimer();
        return audio; 
    }
       
};