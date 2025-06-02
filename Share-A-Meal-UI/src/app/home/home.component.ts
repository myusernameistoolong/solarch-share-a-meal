import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  test: string[] = 'b.'.repeat(40).split('.');

  constructor() { }

  ngOnInit(): void {
  }

}
