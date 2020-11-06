import {Injectable} from '@angular/core';
import * as _ from 'lodash';

export interface Pattern {
    name: 'baggi' | 'pochette';
    variables: { name: string, value: number }[];
}

class Drawer {
    public factor = 3;

    constructor(private ctx: CanvasRenderingContext2D) {

    }

    rect = (left, top, width, height, l = 1) => {
        this.ctx.fillRect(left * this.factor, top * this.factor, width * this.factor, height * this.factor);
        this.ctx.clearRect(left * this.factor + l, top * this.factor + l, width * this.factor - l * 2, height * this.factor - l * 2);
    }

    line = (from: { x: number, y: number }, to: { x: number, y: number }) => {
        this.ctx.beginPath();
        this.ctx.moveTo(from.x * this.factor, from.y * this.factor);
        this.ctx.lineTo(to.x * this.factor, to.y * this.factor);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    hline = (from: { x: number, y: number }, size: number) => {
        this.line(from, {x: from.x + size, y: from.y});
    }

    vline = (from: { x: number, y: number }, size: number) => {
        this.line(from, {x: from.x, y: from.y + size});
    }

    hrule = (from: { x: number, y: number }, size: number, textOffset = 0) => {
        this.hline(from, size);
        this.vline({x: from.x, y: from.y - 2}, 4);
        this.vline({x: from.x + size, y: from.y - 2}, 4);
        this.ctx.fillText(size.toString(), (from.x + size / 2) * this.factor, (from.y + textOffset) * this.factor);
    }

    vrule = (from: { x: number, y: number }, size: number, textOffset = 0) => {
        this.vline(from, size);
        this.hline({x: from.x - 2, y: from.y}, 4);
        this.hline({x: from.x - 2, y: from.y + size}, 4);
        this.ctx.fillText(size.toString(), (from.x + textOffset) * this.factor, (from.y + size / 2) * this.factor);
    }

}

@Injectable({
    providedIn: 'root'
})
export class PatternsService {

    static readonly Patterns: Pattern[] = [
        {name: 'baggi', variables: [{name: 'largeur', value: 40}, {name: 'longueur', value: 60}]},
        // {name: 'masu', variables: [{name: 'largeur', value: 4}, {name: 'longueur', value: 6}]},
        // {name: 'diviseur', variables: [{name: 'largeur', value: 4}, {name: 'longueur', value: 6}]},
        // {name: 'gobelet', variables: [{name: 'largeur', value: 4}, {name: 'longueur', value: 6}]},
        // {name: 'couvercle', variables: [{name: 'largeur', value: 4}, {name: 'longueur', value: 6}]},
        {name: 'pochette', variables: [{name: 'largeur', value: 60}, {name: 'épaisseur', value: 10}]},
        // {name: 'coupelle', variables: [{name: 'largeur', value: 4}, {name: 'longueur', value: 6}]},
    ];

    private patterns: Pattern[] = _.cloneDeep(PatternsService.Patterns);

    constructor() {
    }

    public getListOfPatterns(): string[] {
        return this.patterns.map(p => p.name).slice();
    }

    public getPattern(pattern: string): Pattern {
        return _.cloneDeep(this.patterns.find(p => p.name === pattern));
    }

    public draw(pattern: Pattern, ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.textAlign = 'center';
        ctx.font = '20px Arial';
        const drawer = new Drawer(ctx);
        this['draw' + pattern.name](pattern, drawer);
    }

    private drawbaggi(baggi: Pattern, drawer: Drawer): void {
        const margin = 20;

        const largeur = baggi.variables.find(v => v.name === 'largeur').value;
        const longueur = baggi.variables.find(v => v.name === 'longueur').value;

        for (let y = 0; y < 4; y++) {
            drawer.rect(margin, margin + (y * largeur), largeur, largeur);
            drawer.rect(margin + largeur, margin + (y * largeur), longueur, largeur);
            drawer.rect(margin + largeur + longueur, margin + (y * largeur), largeur, largeur);
        }

        drawer.hrule({x: margin, y: margin - 5}, longueur + largeur * 2, -2);

        drawer.hrule({x: margin, y: margin + largeur * 4 + 5}, largeur, 10);
        drawer.hrule({x: margin + largeur, y: margin + largeur * 4 + 5}, longueur, 10);
        drawer.hrule({x: margin + largeur + longueur, y: margin + largeur * 4 + 5}, largeur, 10);

        drawer.vrule({x: margin - 5, y: margin}, largeur * 4, -10);

        drawer.vrule({x: margin + 5 + longueur + largeur * 2, y: margin}, largeur, 10);
        drawer.vrule({x: margin + 5 + longueur + largeur * 2, y: margin + largeur}, largeur, 10);
        drawer.vrule({x: margin + 5 + longueur + largeur * 2, y: margin + largeur * 2}, largeur, 10);
        drawer.vrule({x: margin + 5 + longueur + largeur * 2, y: margin + largeur * 3}, largeur, 10);
    }

    private drawpochette(pochette: Pattern, drawer: Drawer): void {
        const margin = 10;

        const largeur = pochette.variables.find(v => v.name === 'largeur').value;
        const epaisseur = pochette.variables.find(v => v.name === 'épaisseur').value;

        const square = (x) => {
            drawer.rect(margin + x, margin, largeur, largeur);
        };

        const col = (x) => {
            drawer.rect(margin + x, margin, epaisseur, largeur);
        };

        square(0);
        col(largeur - epaisseur);
        square(largeur);
        col(largeur * 2);
        square(epaisseur + largeur * 2);
        col(epaisseur + largeur * 3);
        square(epaisseur * 2 + largeur * 3);

        drawer.vrule({x: margin - 5, y: margin}, largeur, -20);

        drawer.hrule({x: margin, y: margin - 5}, largeur * 4 + epaisseur * 2, -20);

        drawer.hrule({x: margin, y: margin + largeur + 5}, largeur - epaisseur, +10);
        drawer.hrule({x: margin + largeur - epaisseur, y: margin + largeur + 5}, epaisseur, +10);
        drawer.hrule({x: margin + largeur, y: margin + largeur + 5}, largeur, +10);
        drawer.hrule({x: margin + largeur * 2, y: margin + largeur + 5}, epaisseur, +10);
        drawer.hrule({x: margin + largeur * 2 + epaisseur, y: margin + largeur + 5}, largeur, +10);
        drawer.hrule({x: margin + largeur * 3 + epaisseur, y: margin + largeur + 5}, epaisseur, +10);
        drawer.hrule({x: margin + largeur * 3 + epaisseur * 2, y: margin + largeur + 5}, largeur, +10);

        drawer.hrule({x: margin, y: margin + largeur + 25}, largeur, +10);
        drawer.hrule({x: margin, y: margin + largeur + 45}, largeur * 2, +10);
        drawer.hrule({x: margin, y: margin + largeur + 65}, largeur * 2 + epaisseur, +10);
        drawer.hrule({x: margin, y: margin + largeur + 85}, largeur * 3 + epaisseur, +10);
        drawer.hrule({x: margin, y: margin + largeur + 105}, largeur * 3 + epaisseur * 2, +10);
    }
}
