import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DialogModule } from '@progress/kendo-angular-dialog';

import { AppComponent } from './app.component';
import { EditService } from './edit.service';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { CategoryDetailComponent } from './category-details.component';

@NgModule({
  declarations: [AppComponent, CategoryDetailComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    GridModule,
    DropDownsModule,
    DialogModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ButtonsModule,
  ],
  bootstrap: [AppComponent],
  providers: [EditService],
})
export class AppModule {}
