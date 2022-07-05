"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.card = void 0;
const core_1 = require("@actions/core");
const canvas_1 = require("canvas");
const fs_1 = require("fs");
const minecraft_protocol_1 = require("minecraft-protocol");
const process_1 = require("process");
function extractCardInfo(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pingResult = yield (0, minecraft_protocol_1.ping)(options);
            if (pingResult.prefix) {
                // old version
                return {
                    players: {
                        max: pingResult.maxPlayers,
                        online: pingResult.playerCount
                    },
                    description: pingResult.motd,
                    version: pingResult.version
                };
            }
            else {
                return {
                    players: {
                        max: pingResult.players.max,
                        online: pingResult.players.online
                    },
                    description: typeof pingResult.description === 'string'
                        ? pingResult.description
                        : pingResult.description.text || '',
                    version: pingResult.version.name
                };
            }
        }
        catch (e) {
            (0, core_1.error)(e);
            (0, core_1.setFailed)(e.message);
            (0, process_1.exit)(1);
        }
    });
}
function card(host, port, bgImage) {
    return __awaiter(this, void 0, void 0, function* () {
        const cardInfo = yield extractCardInfo({ host, port });
        const WIDTH = 600;
        const HEIGHT = 100;
        const canvas = (0, canvas_1.createCanvas)(WIDTH, HEIGHT);
        const ctx = canvas.getContext('2d');
        if (bgImage === '') {
            ctx.fillStyle = 'rgb(0,0,0)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
        }
        else {
            ctx.drawImage((0, canvas_1.loadImage)(bgImage), 0, 0, WIDTH, HEIGHT);
        }
        ctx.fillStyle = 'rgb(255,255,255)';
        ctx.font = '18px Impact';
        ctx.fillText(host, 10, 30);
        ctx.fillText(`Version: ${cardInfo.version}`, 10, 80);
        ctx.fillText(`Players: ${cardInfo.players.online}/${cardInfo.players.max}`, 230, 80);
        (0, fs_1.writeFileSync)('./status_card.png', canvas.toBuffer());
    });
}
exports.card = card;
