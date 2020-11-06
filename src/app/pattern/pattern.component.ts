import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {filter, map, tap} from 'rxjs/operators';
import {Pattern, PatternsService} from '../patterns.service';

@Component({
    selector: 'app-pattern',
    templateUrl: './pattern.component.html',
    styleUrls: ['./pattern.component.scss'],
})
export class PatternComponent implements OnInit {
    public pattern: Pattern;

    @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

    constructor(private route: ActivatedRoute, private patternsService: PatternsService) {
    }

    ngOnInit(): void {
        this.route.params.pipe(
            map(params => params.pattern),
            filter(pattern => !!pattern),
            tap((pattern) => this.pattern = this.patternsService.getPattern(pattern)),
            tap(() => this.draw())
        ).subscribe();
    }

    private draw(): void {
        this.patternsService.draw(this.pattern, this.canvas.nativeElement.getContext('2d'));
    }

    public onValueChange(name: string, $event: any): void {
        this.pattern.variables.find(v => v.name === name).value = $event;
        this.draw();
    }
}
