export class IdGenerator {
    constructor(workerId = 1n) {
        this.workerId = workerId % 1024n; // 支持 10 位 workerId (0-1023)
        this.sequence = 0n;
        this.lastTimestamp = -1n;

        // 起始时间戳 (2024-01-01)
        this.twepoch = 1704067200000n;
        this.workerIdBits = 10n;
        this.sequenceBits = 12n;
        this.timestampShift = 22n; // 10 + 12
        this.sequenceMask = -1n ^ (-1n << 12n);
    }

    // 1. 标准 UUID v4
    uuid() {
        return crypto.randomUUID();
    }

    // 2. 雪花 ID (返回字符串以防前端精度丢失)
    snowflake() {
        let timestamp = BigInt(Date.now());

        if (timestamp < this.lastTimestamp) {
            throw new Error("时钟回拨，无法生成 ID");
        }

        if (this.lastTimestamp === timestamp) {
            this.sequence = (this.sequence + 1n) & this.sequenceMask;
            if (this.sequence === 0n) {
                while (timestamp <= this.lastTimestamp) {
                    timestamp = BigInt(Date.now());
                }
            }
        } else {
            this.sequence = 0n;
        }

        this.lastTimestamp = timestamp;

        const id = ((timestamp - this.twepoch) << this.timestampShift) |
            (this.workerId << 12n) |
            this.sequence;
        return id.toString();
    }

    // 3. 雪花 UUID (雪花ID的十六进制 + 随机后缀)
    snowflakeUuid() {
        const sId = BigInt(this.snowflake()).toString(16);
        const random = Math.random().toString(16).substring(2, 10);
        return `${sId}-${random}`;
    }

    generateBatch(type, count) {
        const results = [];
        for (let i = 0; i < count; i++) {
            if (type === 'uuid') results.push(this.uuid());
            else if (type === 'snowflake') results.push(this.snowflake());
            else if (type === 'snowflake-uuid') results.push(this.snowflakeUuid());
        }
        return results;
    }
}
