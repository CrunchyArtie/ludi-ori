import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-pattern-selector',
    templateUrl: './pattern-selector.component.html',
    styleUrls: ['./pattern-selector.component.scss']
})
export class PatternSelectorComponent implements OnInit {
    @Input() public patterns: string[];
    @Input() public active: string;
    @Output() public patternSelected = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit(): void {
    }

    public onTabSelected($event: string): void {
        this.patternSelected.emit($event);
    }
}
