import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CategoriesService } from './northwind.service';
import {
  AddEvent,
  GridDataResult,
  CellClickEvent,
  CellCloseEvent,
  SaveEvent,
  CancelEvent,
  GridComponent,
  RemoveEvent,
} from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Keys } from '@progress/kendo-angular-common';
import { Product, Category } from './model';
import { EditService } from './edit.service';

import { map } from 'rxjs/operators';

@Component({
  providers: [CategoriesService],
  selector: 'my-app',
  template: `
        <kendo-grid
            #grid
            [data]="view | async"
            [pageSize]="gridState.take"
            [skip]="gridState.skip"
            [sort]="gridState.sort"
            [pageable]="true"
            [sortable]="true"
            (cellClick)="cellClickHandler($event)"
            (cellClose)="cellCloseHandler($event)"
            [navigable]="true"
        >
        <kendo-grid-column field="CategoryID" [width]="100"></kendo-grid-column>
        <kendo-grid-column
          field="CategoryName"
          [width]="200"
          title="Category Name"
        ></kendo-grid-column>
        <kendo-grid-column field="Description"> </kendo-grid-column>
        <div *kendoGridDetailTemplate="let dataItem">
          <category-details [category]="dataItem"></category-details>
        </div>
        </kendo-grid>
    `,
})
export class AppComponent implements OnInit, AfterViewInit {
  public view: Observable<GridDataResult>;
  public isLoading: boolean;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 5,
  };

  @ViewChild(GridComponent) grid: GridComponent;

  public changes = {};

  constructor(
    private formBuilder: FormBuilder,
    public editService: EditService,
    private service: CategoriesService
  ) {}

  private loadData(): void {
    this.service.query({
      skip: 0,
      take: 8,
    });
  }

  public ngAfterViewInit(): void {
    // Expand the first row initially
    this.grid.expandRow(0);
  }

  public ngOnInit(): void {
    this.view = this.editService.pipe(
      map((data) => process(data, this.gridState))
    );

    this.editService.read();

    // Bind directly to the service as it is a Subject
    this.view = this.service;
    this.isLoading = this.service.loading;

    // Fetch the data with the initial state
    this.loadData();
  }

  public cellClickHandler(args: CellClickEvent): void {
    if (!args.isEdited) {
      console.log(this.createFormGroup(args.dataItem));
      args.sender.editCell(
        args.rowIndex,
        args.columnIndex,
        this.createFormGroup(args.dataItem)
      );
    }
  }

  public cellCloseHandler(args: CellCloseEvent): void {
    console.log('cellclose');
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
        return;
      }

      this.editService.assignValues(dataItem, formGroup.value);
      this.editService.update(dataItem);
    }
  }

  public createFormGroup(dataItem: Category): FormGroup {
    return this.formBuilder.group({
      CategoryID: dataItem.CategoryID,
      CategoryName: dataItem.CategoryName,
      Description: dataItem.Description,
    });
  }
}
