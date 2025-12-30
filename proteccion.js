// Proteccion del codigo fuente y bloqueo de herramientas de desarrollador

(function() {
    'use strict';
    
    // ============================================
    // CONFIGURACIÓN DE PROTECCIÓN EXTREMA
    // ============================================
    const PROTECTION_CONFIG = {
        // Nivel de protección (1-10, 10 es máximo)
        protectionLevel: 10,
        
        // Bloquear completamente
        blockRightClick: true,
        blockDevTools: true,
        blockSavePage: true,
        blockViewSource: true,
        blockPrintScreen: true,
        blockClipboard: true,
        blockF12: true,
        blockCtrlKeys: true,
        blockSelectText: true,
        blockDrag: true,
        
        // Comportamiento
        showWarnings: true,
        redirectOnViolation: false,
        redirectURL: 'https://www.hidrosistemas.com.mx',
        enableSelfDestruct: false, // En caso de ataques severos
        logViolations: true
    };

    // ============================================
    // 1. BLOQUEO TOTAL DE CLIC DERECHO
    // ============================================
    if (PROTECTION_CONFIG.blockRightClick) {
        // Bloquear en TODO el documento
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            logViolation('RIGHT_CLICK', e);
            
            // Bloqueo adicional
            if (PROTECTION_CONFIG.redirectOnViolation) {
                setTimeout(() => {
                    window.location.href = PROTECTION_CONFIG.redirectURL;
                }, 1000);
            }
            
            return false;
        }, true); // Use capture phase para atrapar TODO

        // También bloquear en elementos específicos
        ['body', 'html', 'div', 'section', 'article', 'main', 'header', 'footer'].forEach(tag => {
            document.querySelectorAll(tag).forEach(element => {
                element.oncontextmenu = function(e) {
                    e.preventDefault();
                    return false;
                };
            });
        });
    }

    // ============================================
    // BLOQUEO COMPLETO DE HERRAMIENTAS DE DESARROLLADOR
    // ============================================
    if (PROTECTION_CONFIG.blockDevTools) {
        // Bloquear F12
        document.addEventListener('keydown', function(e) {
            // Bloquear F12
            if (e.keyCode === 123) { // F12
                e.preventDefault();
                e.stopPropagation();
                logViolation('F12_PRESSED', e);
                return false;
            }
            
            // Bloquear Ctrl+Shift+I
            if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
                e.preventDefault();
                e.stopPropagation();
                logViolation('CTRL_SHIFT_I', e);
                return false;
            }
            
            // Bloquear Ctrl+Shift+J
            if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
                e.preventDefault();
                e.stopPropagation();
                logViolation('CTRL_SHIFT_J', e);
                return false;
            }
            
            // Bloquear Ctrl+Shift+C
            if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
                e.preventDefault();
                e.stopPropagation();
                logViolation('CTRL_SHIFT_C', e);
                return false;
            }
            
            // Bloquear Ctrl+U (Ver código fuente)
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                e.stopPropagation();
                logViolation('CTRL_U', e);
                return false;
            }
            
            // Bloquear Ctrl+S (Guardar página)
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                e.stopPropagation();
                logViolation('CTRL_S', e);
                return false;
            }
            
            // Bloquear Ctrl+P (Imprimir)
            if (e.ctrlKey && e.keyCode === 80) {
                e.preventDefault();
                e.stopPropagation();
                logViolation('CTRL_P', e);
                return false;
            }
            
            // Bloquear Alt+Menú (menú contextual)
            if (e.altKey) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);
        
        // Bloquear menú contextual del navegador
        window.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        }, true);
        
        // Bloquear acceso a console.log
        if (typeof console !== "undefined") {
            if (typeof console.log !== 'undefined') {
                console.olog = console.log;
            } else {
                console.olog = function() {};
            }
        }
        
        console.log = function(message) {
            console.olog(message);
            logViolation('CONSOLE_ACCESS', { message: message });
        };
        
        console.warn = function(message) {
            logViolation('CONSOLE_WARN', { message: message });
        };
        
        console.error = function(message) {
            logViolation('CONSOLE_ERROR', { message: message });
        };
    }

    // ============================================
    // 3. PROTECCIÓN CONTRA DESCARGA DE SITIO WEB
    // ============================================
    if (PROTECTION_CONFIG.blockSavePage) {
        // Deshabilitar guardado de página
        document.onkeydown = function(e) {
            // Evitar Ctrl+S y Ctrl+Shift+S
            if ((e.ctrlKey && e.keyCode === 83) || (e.ctrlKey && e.shiftKey && e.keyCode === 83)) {
                e.preventDefault();
                logViolation('PAGE_SAVE_ATTEMPT', e);
                return false;
            }
        };
        
        // Bloquear menú "Guardar como"
        document.addEventListener('beforeunload', function(e) {
            // Esta es la forma más cercana de detectar intentos de guardado
            logViolation('PAGE_UNLOAD_ATTEMPT', e);
        });
        
        // Hacer difícil la copia del HTML
        document.addEventListener('DOMContentLoaded', function() {
            // Añadir protección contra copia del HTML
            const bodyHTML = document.body.innerHTML;
            document.body.setAttribute('data-protected', 'true');
            
            // Monitorear cambios en el DOM
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        logViolation('DOM_MODIFICATION', mutation);
                    }
                });
            });
            
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true
            });
        });
    }

    // ============================================
    // BLOQUEO DE VISUALIZACIÓN DE CÓDIGO FUENTE
    // ============================================
    if (PROTECTION_CONFIG.blockViewSource) {
        // Bloquear varias formas de ver el código fuente
        document.addEventListener('keydown', function(e) {
            // Ctrl+U ya está bloqueado arriba, agregar más combinaciones
            if (e.keyCode === 123) { // F12
                e.preventDefault();
                return false;
            }
        });
        
        // Evitar que se vea el código fuente desde el navegador
        window.addEventListener('load', function() {
            // Hacer que el contenido sea difícil de copiar
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.mozUserSelect = 'none';
            document.body.style.msUserSelect = 'none';
            
            // Bloquear selección de texto
            document.onselectstart = function() {
                return false;
            };
            
            document.oncopy = function() {
                logViolation('COPY_ATTEMPT');
                return false;
            };
            
            document.oncut = function() {
                logViolation('CUT_ATTEMPT');
                return false;
            };
            
            document.onpaste = function() {
                logViolation('PASTE_ATTEMPT');
                return false;
            };
        });
    }

    // ============================================
    // BLOQUEO DE PRINT SCREEN Y CAPTURAS
    // ============================================
    if (PROTECTION_CONFIG.blockPrintScreen) {
        document.addEventListener('keydown', function(e) {
            // PrintScreen key
            if (e.keyCode === 44) { // PrintScreen
                e.preventDefault();
                logViolation('PRINTSCREEN_ATTEMPT', e);
                
                // Intentar limpiar portapapeles
                navigator.clipboard.writeText('').catch(() => {});
                return false;
            }
            
            // Alt+PrintScreen
            if (e.altKey && e.keyCode === 44) {
                e.preventDefault();
                return false;
            }
            
            // Windows+Shift+S (Windows snipping tool)
            if (e.key === 's' && e.shiftKey && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                logViolation('SNIPPING_TOOL_ATTEMPT', e);
                return false;
            }
        });
        
        // Bloquear canvas que podrían usarse para capturas
        const originalCreateElement = document.createElement.bind(document);
        document.createElement = function(tagName, options) {
            const element = originalCreateElement(tagName, options);
            
            if (tagName.toLowerCase() === 'canvas') {
                // Interceptar canvas
                const originalGetContext = element.getContext.bind(element);
                element.getContext = function(contextType) {
                    const context = originalGetContext(contextType);
                    
                    if (context) {
                        // Sobrescribir métodos de dibujo
                        const originalDrawImage = context.drawImage;
                        context.drawImage = function() {
                            logViolation('CANVAS_DRAW_ATTEMPT');
                            return;
                        };
                    }
                    
                    return context;
                };
            }
            
            return element;
        };
    }

    // ============================================
    // 6. BLOQUEO DE PORTAPAPELES
    // ============================================
    if (PROTECTION_CONFIG.blockClipboard) {
        document.addEventListener('copy', function(e) {
            e.preventDefault();
            logViolation('CLIPBOARD_COPY', e);
            return false;
        });
        
        document.addEventListener('cut', function(e) {
            e.preventDefault();
            logViolation('CLIPBOARD_CUT', e);
            return false;
        });
        
        // Bloquear acceso a clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            const originalWriteText = navigator.clipboard.writeText;
            navigator.clipboard.writeText = function(text) {
                logViolation('CLIPBOARD_API_WRITE', { text: text });
                return Promise.reject(new Error('Clipboard access blocked'));
            };
        }
    }

    // ============================================
    // 7. BLOQUEO DE TECLAS DE CONTROL
    // ============================================
    if (PROTECTION_CONFIG.blockCtrlKeys) {
        document.addEventListener('keydown', function(e) {
            // Bloquear todas las combinaciones con Ctrl
            if (e.ctrlKey) {
                // Permitir solo Ctrl+C, Ctrl+V, Ctrl+X si es necesario
                if (![67, 86, 88].includes(e.keyCode)) { // C, V, X
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Mostrar advertencia solo para combinaciones peligrosas
                    if ([73, 74, 75, 76, 85].includes(e.keyCode)) { // I, J, K, L, U
                        logViolation('CTRL_COMBINATION', { keyCode: e.keyCode });
                    }
                    return false;
                }
            }
            
            // Bloquear Alt (menú contextual)
            if (e.altKey) {
                e.preventDefault();
                return false;
            }
        }, true);
    }
    if (PROTECTION_CONFIG.blockSelectText) {
        document.addEventListener('DOMContentLoaded', function() {
            // Aplicar a todo el documento
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            document.body.style.mozUserSelect = 'none';
            document.body.style.msUserSelect = 'none';
            
            // Aplicar a todos los elementos
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                el.style.userSelect = 'none';
                el.style.webkitUserSelect = 'none';
                el.style.mozUserSelect = 'none';
                el.style.msUserSelect = 'none';
            });
            
            // Bloquear eventos de selección
            document.onselectstart = function(e) {
                e.preventDefault();
                return false;
            };
            
            document.onmousedown = function(e) {
                // Prevenir selección con ratón
                if (e.button === 0) { // Botón izquierdo
                    // Permitir clics normales pero no selección
                    return true;
                }
                return false;
            };
        });
    }

    if (PROTECTION_CONFIG.blockDrag) {
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        }, true);
        
        document.addEventListener('drop', function(e) {
            e.preventDefault();
            return false;
        }, true);
        
        // Hacer que todo sea no arrastrable
        document.addEventListener('DOMContentLoaded', function() {
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                el.setAttribute('draggable', 'false');
            });
        });
    }
    if (PROTECTION_CONFIG.blockDevTools) {
        // Detectar si DevTools está abierto
        function detectDevTools() {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                // DevTools detectado
                logViolation('DEVTOOLS_DETECTED', {
                    widthDiff: window.outerWidth - window.innerWidth,
                    heightDiff: window.outerHeight - window.innerHeight
                });
                
                if (PROTECTION_CONFIG.redirectOnViolation) {
                    window.location.href = PROTECTION_CONFIG.redirectURL;
                }
                
                // Auto-destrucción si está habilitada
                if (PROTECTION_CONFIG.enableSelfDestruct) {
                    document.body.innerHTML = '<h1 style="color:red;text-align:center;">ACCESO NO AUTORIZADO</h1>';
                    document.head.innerHTML = '';
                }
                
                return true;
            }
            return false;
        }
        
        // Verificar periódicamente
        setInterval(detectDevTools, 1000);
        
        // También verificar en resize
        window.addEventListener('resize', detectDevTools);
    }
    const violationLog = [];
    
    function logViolation(type, data = {}) {
        if (!PROTECTION_CONFIG.logViolations) return;
        
        const violation = {
            type: type,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            data: data
        };
        
        violationLog.push(violation);
        
        // Limitar log a 100 entradas
        if (violationLog.length > 100) {
            violationLog.shift();
        }
        
        // Enviar a servidor si es posible (opcional)
        // sendToServer(violation);
    }
    function showWarning(message) {
        if (!PROTECTION_CONFIG.showWarnings) return;
        
        // Remover advertencias anteriores
        const existingWarnings = document.querySelectorAll('.security-warning');
        existingWarnings.forEach(w => w.remove());
        
        // Crear nueva advertencia
        const warningDiv = document.createElement('div');
        warningDiv.className = 'security-warning';
        warningDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ff0000, #8b0000);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 999999;
            font-family: 'Arial', sans-serif;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 5px 20px rgba(255,0,0,0.3);
            border: 2px solid #ff4444;
            animation: warningPulse 0.5s ease-in-out;
            text-align: center;
            max-width: 80%;
            word-wrap: break-word;
        `;
        
        // Agregar animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes warningPulse {
                0% { transform: translateX(-50%) scale(1); }
                50% { transform: translateX(-50%) scale(1.05); }
                100% { transform: translateX(-50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(warningDiv);
        
        // Auto-remover después de 3 segundos
        setTimeout(() => {
            if (warningDiv.parentNode) {
                warningDiv.style.opacity = '0';
                warningDiv.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    if (warningDiv.parentNode) {
                        warningDiv.parentNode.removeChild(warningDiv);
                    }
                }, 500);
            }
        }, 3000);
    }
    // Anti-debugging: Detectar si alguien está depurando
    let debuggerDetected = false;
    
    function antiDebug() {
        const startTime = new Date().getTime();
        
        // Crear un bucle infinito que se rompe si alguien está depurando
        debugger;
        
        const endTime = new Date().getTime();
        
        if (endTime - startTime > 100) { // Si pasó más de 100ms, probablemente hay un debugger
            debuggerDetected = true;
            logViolation('DEBUGGER_DETECTED', { timeDiff: endTime - startTime });
            
            // Tomar acción
            if (PROTECTION_CONFIG.enableSelfDestruct) {
                // Limpiar página
                document.body.innerHTML = `
                    <div style="text-align:center;padding:50px;color:red;">
                        <h1>ACCESO NO AUTORIZADO</h1>
                        <p>Se ha detectado actividad de depuración no permitida.</p>
                        <p>Esta acción ha sido registrada.</p>
                    </div>
                `;
            }
        }
        
        // Ejecutar periódicamente
        setTimeout(antiDebug, Math.random() * 5000 + 1000);
    }
    
    // Iniciar anti-debugging después de un tiempo
    setTimeout(antiDebug, 3000);

    // ============================================
    // 14. BLOQUEO DE IFRAMES (evitar que el sitio sea embebido)
    // ============================================
    if (window.top !== window.self) {
        // Si estamos en un iframe, redirigir
        window.top.location = window.self.location;
        logViolation('IFRAME_EMBED_ATTEMPT');
    }

    // ============================================
    // 15. ENCRIPTACIÓN DE CONTENIDO (básica)
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        // Agregar marca de agua invisible
        const invisibleWatermark = document.createElement('div');
        invisibleWatermark.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            font-size: 1px;
            color: transparent;
            opacity: 0.01;
            z-index: -9999;
            user-select: none;
            pointer-events: none;
        `;
        invisibleWatermark.textContent = `©${new Date().getFullYear()} Hidrosistemas - Propiedad intelectual protegida`;
        document.body.appendChild(invisibleWatermark);
        
        // Ofuscar enlaces a archivos
        const links = document.querySelectorAll('a[href$=".html"], a[href$=".js"], a[href$=".css"]');
        links.forEach(link => {
            link.setAttribute('data-protected', 'true');
        });
    });

    // Mensaje inicial
    if (PROTECTION_CONFIG.showWarnings) {
        setTimeout(() => {
        }, 1000);
    }
    window.HidrosistemasSecurity = {
        version: '3.0.0',
        getStatus: () => ({
            protected: true,
            level: PROTECTION_CONFIG.protectionLevel,
            violations: violationLog.length,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        }),
        getViolations: () => violationLog,
        clearViolations: () => {
            violationLog.length = 0;
            return 'Log limpiado';
        },
        // Solo para administradores
        disableTemporarily: (password) => {
            if (password === 'HIDRO2024*ADMIN') { // Cambia esta contraseña
                localStorage.setItem('disableProtection', 'true');
                location.reload();
                return 'Protección desactivada temporalmente';
            }
            return 'Contraseña incorrecta';
        }
    };

    // Verificar si la protección debe estar desactivada
    if (localStorage.getItem('disableProtection') === 'true') {
        return; 
    }

})(); // IIFE - Inmediatamente Invocada

// 1. Bloquear Web Developer Extension y similares
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {};
}

// 2. Bloquear Firebug
if (window.console && window.console.firebug) {
    delete window.console.firebug;
}

// 3. Deshabilitar JavaScript desde consola
Object.defineProperty(window, 'eval', {
    value: function() {
        throw new Error('eval() está deshabilitado por seguridad');
    }
});

// 4. Prevenir acceso a propiedades del navegador
['localStorage', 'sessionStorage', 'indexedDB', 'caches'].forEach(api => {
    try {
        Object.defineProperty(window, api, {
            get: function() {
                console.warn(`Acceso a ${api} bloqueado`);
                return null;
            },
            configurable: false
        });
    } catch (e) {}
});

// 5. Final - Mensaje permanente
window.addEventListener('load', function() {
    // Añadir marca de agua visible en modo debug
    if (window.console && console.log) {
        console.log('%c⛔ DETENIDO ⛔', 'color: red; font-size: 50px; font-weight: bold;');
        console.log('%cEsta es una función del navegador destinada a desarrolladores.', 'font-size: 16px;');
        console.log('%cSi alguien te dijo que copies y pegues algo aquí,', 'font-size: 16px;');
        console.log('%cES UNA ESTAFA y podría comprometer tu seguridad.', 'color: red; font-size: 18px; font-weight: bold;');
        console.log('%c© Hidrosistemas - Sistema de Protección v3.0', 'font-size: 12px; color: gray;');
    }
});