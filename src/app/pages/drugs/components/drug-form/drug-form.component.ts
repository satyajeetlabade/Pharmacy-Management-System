import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { DrugType } from "../../models/drug.model";
import { DrugService } from "../../services/drug.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-drug-form',
  standalone: true,
  providers: [DatePipe],
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './drug-form.component.html',
  styleUrl: './drug-form.component.css'
})
export class DrugFormComponent implements OnInit {

  drugForm!: FormGroup;
  drugTypes = Object.keys(DrugType)
    .filter(key => isNaN(Number(key)))
    .map(key => ({ key, value: DrugType[key as keyof typeof DrugType] }));

  constructor(
    private fb: FormBuilder,
    private drugService: DrugService,
    private route: ActivatedRoute,
    private router: Router,
    private tostr: ToastrService
  ) {}

  ngOnInit(): void {
    this.drugForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantityInStock: [0, [Validators.required, Validators.min(0.01)]],
      expiryDate: ['', Validators.required],
      drugType: [null, Validators.required],
    });

  }

  onSubmit(){
    if(this.drugForm.valid)
    {
      this.drugService.create(this.drugForm.value).subscribe({
        next:(respones) =>{
          this.tostr.success("Drug created successfully.");
          this.router.navigate(['/drugs']);
        },
        error:(error) =>{
          this.tostr.error("Error creating drug: " + error.message);
        }
      });
    }
  }
}
