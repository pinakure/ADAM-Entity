from django.shortcuts import render
from django.http import JsonResponse
import json
import emoji
import re

def dashboard(request):
    return render(request, 'base.html')

def tokenize(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            texto_sucio = data.get('text', '')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'JSON inválido'}, status=400)

        if not texto_sucio:
            return JsonResponse({'error': 'El campo de texto está vacío'}, status=400)

        # 1. Identificamos los emojis reales presentes en el texto
        emojis_encontrados = {e.chars for e in emoji.analyze(texto_sucio)}

        tokens_estructurados = []
        solo_emojis = []

        if emojis_encontrados:
            # 2. Creamos el patrón ordenando por longitud para emojis complejos
            emoji_pattern = "|".join(re.escape(e) for e in sorted(emojis_encontrados, key=len, reverse=True))
            patron_divisor = re.compile(f"({emoji_pattern})")
            
            # 3. Separamos manteniendo los emojis intactos gracias a los paréntesis de captura
            tokens_brutos = patron_divisor.split(texto_sucio)
            
            # 4. Clasificamos cada fragmento de la lista
            for token in tokens_brutos:
                token_limpio = token.strip()
                if token_limpio:  # Ignoramos espacios en blanco vacíos
                    if token_limpio in emojis_encontrados:
                        tipo_token = "emoji"
                        solo_emojis.append(token_limpio)
                    else:
                        tipo_token = "text"
                    
                    # Estructuramos el token como un diccionario/objeto
                    tokens_estructurados.append({
                        'type'  : tipo_token,
                        'value' : token_limpio.lstrip(',').lstrip(' '),
                        'audio' : None,
                    })
        else:
            # Si no hay ningún emoji, todo el texto es un bloque de tipo texto
            texto_limpio = texto_sucio.strip()
            if texto_limpio:
                tokens_estructurados.append({
                    'type': 'text',
                    'value': texto_limpio,
                    'audio': None,
                })

        return JsonResponse({
            'status': 'success',
            'tokens': tokens_estructurados,  # Lista de objetos estructurados
            'emojis': solo_emojis,           # Lista plana solo con los emojis
            'total_tokens': len(tokens_estructurados)
        })

    return JsonResponse({'error': 'Método no permitido.'}, status=405)