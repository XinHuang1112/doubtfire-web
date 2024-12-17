import { Component, Input, OnChanges } from '@angular/core';
import { GradeService } from 'src/app/common/services/grade.service';

@Component({
  selector: 'f-grade-icon',
  templateUrl: './grade-icon.component.html',

})
export class GradeIconComponent implements OnChanges {
  @Input() inputGrade: string | number;
  @Input() colorful: boolean;

  grade: number;
  constructor(private gradeService: GradeService) {
    this.updateGrade();
  }

  ngOnChanges() {
    this.updateGrade();
  }

  updateGrade() {
    if (typeof this.inputGrade === 'string') {
      this.grade = this.gradeService.stringToGrade(this.inputGrade);
    } else {
      this.grade = this.inputGrade;
    }
  }

  gradeText(grade: number): string {
    return this.gradeService.grades[grade] || 'Grade';
  }

  gradeLetter(grade: number): string {
    return this.gradeService.gradeAcronyms[grade] || 'G';
  }
}
