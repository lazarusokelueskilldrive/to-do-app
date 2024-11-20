import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerService } from '../../services/spinner.service';
import { UiService } from '../../services/ui.service';
import { modal, store } from '../../config';
import { Observable } from 'rxjs';

interface IRecord {
  id:string,
  title: string,
  description: string,
  date: Date
  isDeleted: boolean
  status:string
}

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    FormsModule,
    CommonModule,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit{

  form!:FormGroup
  storeRecord: IRecord[] = [];
  key: string = "task";
  todayDate!: string;

  constructor(
    private _fb: FormBuilder,
     private _ui: UiService,
     private _spinner: SpinnerService,
    ){}

  ngOnInit(): void {
    this.initializer();
    this.getRecords();
    this.getDateRangeFromToday();
  }

  initializer(){
    this.form = this._fb.group({
      id:[''],
      title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      description:['', [Validators.required, Validators.minLength(4), Validators.maxLength(120)]],
      date:[null, Validators.required]
    })
  }

  getDateRangeFromToday(){
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    this.todayDate = `${yyyy}-${mm}-${dd}`;
  }

  addTask(){
    modal.show(`#create-task`);
  }
  getRecords(){
    const record = store.get(this.key);
    this.storeRecord = record !== "" ? store.parse(record) : [];
  }

  createTask(){
    try {
      this._spinner.busy();
      const formData =  this.form.getRawValue();
      const payload  = {...formData,
        id: store.getRandomGUID(),
        status : "new",
        isDeleted: false,
      }
      // Fetch stored records from the store
      const storedRecords = store.get(this.key);
      const parsedRecords = storedRecords !== "" ? store.parse(storedRecords) : [];

      parsedRecords.unshift(payload);

      store.set(this.key, store.stringify(parsedRecords));
      this._ui.success("Task successfully created");
      modal.hide(`#create-task`);
      this.reset();
      this.getRecords();
    } catch (error) {
      console.error("Error creating task:", error);
      this._ui.error("An error occurred while creating the task");
    } finally {
      setTimeout(() => {
        this._spinner.idle();
      }, 1000)
     
    }
  }

  reset(){
    this.form.reset();
  }

  updateStatus(target: string){
    debugger
    const storedRecords = store.get(this.key);
    const parsedRecords = storedRecords !== "" ? store.parse(storedRecords) : [];

    if (parsedRecords) {
      const selectedRecord =  parsedRecords.filter( (x: any) => x.title === target);
      const newRecord =  parsedRecords.filter( (x: any) => x.title !== target);
      selectedRecord[0].status = "completed";
      newRecord.unshift(selectedRecord[0]);
      store.set(this.key, store.stringify(newRecord));
      this._ui.success("Status updated successfully");
      this.getRecords();
    }else{
      this._ui.success("Invalid record");
    }
  }

  editTask(item : IRecord){
    debugger
    this.form = this._fb.group({
      id:[item['id']],
      title: [item['title'], [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      description:[item['description'], [Validators.required, Validators.minLength(4), Validators.maxLength(120)]],
      date:[item['date'], Validators.required],
      isDelete:[item['isDeleted']],
      status: [item['status']]
    })
    modal.show(`#edit-task`);
  }

  update(){
    try{
      debugger
      this._spinner.busy();
      const formData =  this.form.getRawValue();

      // Fetch stored records from the store
      const storedRecords = store.get(this.key);
      const parsedRecords = storedRecords !== "" ? store.parse(storedRecords) : [];

      const newRecord =  parsedRecords.filter( (x: any) => x.id !== formData.id);
      newRecord.unshift(formData);
      store.remove(this.key);
      store.set(this.key, store.stringify(newRecord));
      this._ui.success("Task updated successfully");
      modal.hide(`#edit-task`);
      this.form.reset();
      this.getRecords();
    }catch(error){
      console.error("Error editing task:", error);
      this._ui.error("An error occurred while editing the task");
    } finally {
      setTimeout(() => {
        this._spinner.idle();
      }, 1000)
    }
  }

  deleteById(id:string){
    modal.show(`#delete-task`);
    this.form = this._fb.group({
      id: [id, Validators.required]
    });
  }


  deleteTask(){
    try{
      this._spinner.busy();
      const payload = this.form.getRawValue();

      // Fetch stored records from the store
      const storedRecords = store.get(this.key);
      const parsedRecords = storedRecords !== "" ? store.parse(storedRecords) : [];

      const newRecord =  parsedRecords.filter( (x: any) => x.id !== payload.id);
      store.set(this.key, store.stringify(newRecord));
      this._ui.success("Task deleted successfully");
      modal.hide(`#delete-task`);
      this.reset();
      this.getRecords();
    }catch(error){
      console.error("Error editing task:", error);
      this._ui.error("An error occurred while editing the task");
    }finally{
      setTimeout(() => {
        this._spinner.idle();
      }, 1000)
    }
    
  }
}
