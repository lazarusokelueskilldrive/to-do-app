import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import path from 'path';
import { AppComponent } from './app.component';
import { TaskComponent } from './components/task/task.component';

export const routes: Routes = [
    { path: '',redirectTo: 'task', pathMatch: 'full'},
    {path: "", component: AppComponent, 
        children:[
        {path:"task", component: TaskComponent}
   ]}
];
