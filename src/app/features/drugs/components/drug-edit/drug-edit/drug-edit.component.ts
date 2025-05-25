import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DrugType } from '../../../models/drug.model';
import { DrugService } from '../../../services/drug.service';

@Component({
  selector: 'app-drug-edit',
  standalone: true,
  imports: [RouterModule,CommonModule, ReactiveFormsModule],
  templateUrl: './drug-edit.component.html',
  styleUrls: ['./drug-edit.component.css'],
  providers: [DatePipe]
})
export class DrugEditComponent implements OnInit {

  drugForm!: FormGroup;
  drugId!: number;
  drugTypes = Object.keys(DrugType)
    .filter(k => isNaN(Number(k)))
    .map(k => ({ key: k, value: DrugType[k as keyof typeof DrugType] }));

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private drugService: DrugService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.drugForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantityInStock: [0, [Validators.required, Validators.min(0.01)]],
      expiryDate: ['', Validators.required],
      drugType: [null, Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.drugId = +id;
        this.loadDrugData(this.drugId);
      }
    });
  }

  loadDrugData(id: number): void {
    this.drugService.getById(id).subscribe(drug => {
      const formattedDate = this.datePipe.transform(drug.expiryDate, 'yyyy-MM-dd');
      this.drugForm.patchValue({
        ...drug,
        expiryDate: formattedDate
      });
    });
  }

  onSubmit(): void {
    if (this.drugForm.invalid) return;

    const updatedDrug = this.drugForm.value;
    updatedDrug.id = this.drugId;
    this.drugService.update(this.drugId, updatedDrug).subscribe(() => {
      this.router.navigate(['/drugs']);
      
    });
  }
}
