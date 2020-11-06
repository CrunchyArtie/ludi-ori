import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PatternsService} from './patterns.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    patterns = [];
    activePattern: string;

    constructor(private router: Router, private patternsService: PatternsService) {
    }

    ngOnInit(): void {
        this.patterns = this.patternsService.getListOfPatterns();
        this.activePattern = this.patterns[0];
    }

    openPattern($event: string): void {
        this.activePattern = $event;
        this.router.navigate(['pattern', this.activePattern]);
    }
}
