export class CooldownTimer {
    cooldown = 0;
    codeCooldownInterval: any | null = null;

    onTick: (time: number) => void = () => {};
    onFinish: () => void = () => {};

    start(seconds: number) {
        this.cooldown = seconds;
        this.onTick(this.cooldown);
        if (this.codeCooldownInterval !== null) {
            return;
        }
        this.codeCooldownInterval = setInterval(() => {
            if (this.cooldown > 0) {
                this.cooldown -= 1;
                this.onTick(this.cooldown);
            } else if (this.codeCooldownInterval !== null) {
                clearInterval(this.codeCooldownInterval);
                this.codeCooldownInterval = null;
                this.onFinish();
            }
        }, 1000);
    }

    stop() {
        if (this.codeCooldownInterval !== null) {
            clearInterval(this.codeCooldownInterval);
            this.codeCooldownInterval = null;
        }
    }
}
