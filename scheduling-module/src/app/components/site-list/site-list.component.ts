import { Component, OnInit, ElementRef} from '@angular/core';
import { DataService } from './../../services/data.service'
import { SiteModel } from './../../models/site.model'
import { DraggableDirective } from './../../drag-drop-module/draggable.directive'


@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent implements OnInit {

  SiteList: SiteModel[];// =[{Name:'Frank'}, {Name: 'Joe'}, {Name:'Mel'}];
  startIndex: number;
  currentIndex: number;
  startItem: DraggableDirective;
  currentItem: DraggableDirective;
  dragOver: boolean = false;

 
  constructor(private svcData: DataService) { }
  
  ngOnInit() {
    this.svcData.getSites("22243")
      .subscribe( 
        (meldata: SiteModel[]) => {
          this.SiteList = meldata;
      },
      errorInconceivable => {
        console.log(errorInconceivable)
      }
      
      )
  }

  onDragStart( event: {draggable: DraggableDirective, index: number} ) {
    this.dragOver = false;
    this.startItem = event.draggable;
    this.startIndex = event.index;
    console.log("got start element")
    console.log(`start y is ${this.startItem.startPosition.y}`)
  }

  
  onItemTraversed(event:{draggable:DraggableDirective, index: number}) {
    if (this.dragOver)
    return;
    console.log(`updating index to ${event.index}`)
    this.currentIndex = event.index;
   // this.currentItem = event.draggable;
  }

  onDragEnd( event: {el: ElementRef} ) {
    this.dragOver = true;
    console.log("drag end")
 
    this.updateModel();
    this.clear();
  }

  updateModel() {
    console.log(`before update ${this.SiteList}`)
    const sourceModel = this.SiteList[this.startIndex];
    const destModel = this.SiteList[this.currentIndex];

    let i: number = 0;
    let j: number = 0;
    let reorderedArray: SiteModel[] = [];
    /*
    make a copy of the site list array - remove the start and dest elements;
    loop thorugh 
    */
    const listCopied = this.SiteList.slice();
    listCopied.splice(this.startIndex, 1) // remove the moving element ( its already stored)
  
    
    for(i; i < this.SiteList.length; i++){
      if( i != this.currentIndex ) {
        reorderedArray[i] = listCopied[j];
        j++;
      } else if( i == this.currentIndex ) {
        reorderedArray[i]= sourceModel;
      } 

    }

    /*
different than the tutorial this was based on, the goal is to change the order, not swap 
so moving element gets inserted after the drop node 


    */

    this.SiteList = reorderedArray;
    
    console.log(`after update ${this.SiteList}`)
  }

  clear() {
    this.startIndex = null;
    this.currentIndex = null;
    this.startItem = null;
    this.currentItem = null;
    
  }

  


  // onDragMove(event: PointerEvent) {
  //   console.log('got drag move')
  // }

  // onDragStart(event: PointerEvent) {
  // console.log('got drag start' + Math.round(event.clientX).toString() )
  // }

  // onDragEnd(event: PointerEvent) {
  //   console.log("got drag end")
  // }


}
