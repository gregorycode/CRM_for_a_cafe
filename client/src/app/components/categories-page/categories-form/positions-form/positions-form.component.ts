import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {Position} from "../../../shared/interfaces";
import {MaterialService, MaterialInstance} from "../../../shared/classes/material.service";
import {FormGroup, FormControl, Validators} from "@angular/forms";
@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  positions: Position[] = [];
  loading: boolean =  false;
  modal: MaterialInstance;
  form: FormGroup;
  positionId = null;

  constructor(private pos: PositionsService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })
    this.loading = true;
    this.pos.fetch(this.categoryId).subscribe((positions: Position[]) => {
      this.positions = positions;
      this.loading = false;
    })
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  onSelectPosition(position: Position): void {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Are you sure you want to delete "${position.name}" position`);

    if (decision) {
      return this.pos.delete(position._id).subscribe(
        response => {
          const index = this.positions.findIndex(p => p._id === position._id);

          if (index || index === 0) {
            this.positions.splice(index, 1);
          }
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }

  onAddPosition(): void {
    this.positionId = null;
    this.form.reset({name: null, cost: 1})
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onCancel(): void {
    this.modal.close();
  }

  onSubmit(): void {
    this.form.disable();
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const completed = () => {
      this.modal.close();
      this.form.reset({name: '', cost: 1})
      this.form.enable();
    }

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.pos.update(newPosition).subscribe((position: Position) => {
          const index = this.positions.findIndex(p => p._id === position._id);

          if (index || index === 0) {
            this.positions[index] = position;
          }

          MaterialService.toast('Position has been successfully updated');
        }, error => MaterialService.toast(error.error.message),
        completed
      );
    } else {
      this.pos.create(newPosition).subscribe((position: Position) => {
          MaterialService.toast('Position has been successfully created');
          this.positions.push(position);
      }, error => MaterialService.toast(error.error.message),
        completed
      );
    }


  }

}
