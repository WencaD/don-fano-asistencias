// Servicio para generación de códigos QR dinámicos
class QRService {
    constructor() {
        this.currentCode = null;
        this.expirationTime = 60;
        this.generateCode();
        this.startTimer();
    }

    generateCode() {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();

        this.currentCode = {
            code,
            expiresIn: this.expirationTime,
            createdAt: Date.now()
        };
    }

    startTimer() {
        setInterval(() => {
            if (!this.currentCode) return;

            const secondsPassed = Math.floor((Date.now() - this.currentCode.createdAt) / 1000);
            const remaining = this.expirationTime - secondsPassed;

            if (remaining <= 0) {
                this.generateCode();
            } else {
                this.currentCode.expiresIn = remaining;
            }
        }, 1000);
    }

    getCurrentCode() {
        return {
            codigo: this.currentCode.code,
            expira_en: this.currentCode.expiresIn
        };
    }

    validateCode(code) {
        return code === this.currentCode.code;
    }
}

const qrService = new QRService();

module.exports = {
    getCodigoActual: () => qrService.getCurrentCode(),
    validarCodigo: (code) => qrService.validateCode(code)
};