import { Component, Input, OnInit } from '@angular/core';
import { DoubtfireConstants } from 'src/app/config/constants/doubtfire-constants';
import { AlertService } from 'src/app/common/services/alert.service';
import { UnitService } from 'src/app/api/services/unit.service';
import { TeachingPeriodService } from 'src/app/api/services/teaching-period.service';
import { TaskSubmissionService } from 'src/app/common/services/task-submission.service';
import { Unit } from 'src/app/api/models/unit';




@Component({
  selector: 'unit-details-editor',
  templateUrl: './unit-details-editor.component.html',
})
export class UnitDetailsEditorComponent implements OnInit {
  @Input() unit: Unit;
  overseerEnabled: boolean = false;
  calOptions = {
    startOpened: false,
    endOpened: false,
    portfolioAutoGenerationOpened: false
  };
  dockerImages: any[] = [];
  externalName: string = '';
  teachingPeriods: any[] = [];
  teachingPeriodValues: { value: any; text: string }[] = [{ value: undefined, text: 'None' }];
  taskDefinitionValues: { value: any; text: string }[] = [{ value: undefined, text: 'None' }];
  studentSearch: string = '';

  constructor(
    private doubtfireConstants: DoubtfireConstants,
    private newUnitService: UnitService,
    private alertService: AlertService,
    private newTeachingPeriodService: TeachingPeriodService,
    private taskSubmission: TaskSubmissionService
  ) {}

  ngOnInit(): void {
    this.overseerEnabled = this.doubtfireConstants.IsOverseerEnabled.value;

    // Load Docker images
    this.taskSubmission.getDockerImagesAsPromise().then((images) => {
      this.dockerImages = images;
    });

    this.externalName = this.doubtfireConstants.ExternalName.value;

    // Load teaching periods
    this.newTeachingPeriodService.query().subscribe((periods) => {
      this.teachingPeriods = periods;
      const other = periods.map((p) => ({ value: p, text: `${p.year} ${p.period}` }));
      this.teachingPeriodValues.push(...other);
    });

    // Subscribe to task definitions
    this.unit.taskDefinitionCache.values.subscribe((taskDefs) => {
      const other = taskDefs.map((td) => ({
        value: td,
        text: `${td.abbreviation}-${td.name}`
      }));
      this.taskDefinitionValues.push(...other);
    });
  }

  teachingPeriodSelected(event: any): void {
    this.teachingPeriods.forEach((period) => {
      if (period === event) {
        // Set the selected teaching period
      }
    });
  }

  draftTaskDefSelected(event: any): void {
    // Set the selected draft task definition
  }

  open(event: Event, pickerData: string): void {
    event.preventDefault();
    event.stopPropagation();

    if (pickerData === 'start') {
      this.calOptions.startOpened = !this.calOptions.startOpened;
      this.calOptions.endOpened = false;
      this.calOptions.portfolioAutoGenerationOpened = false;
    } else if (pickerData === 'end') {
      this.calOptions.startOpened = false;
      this.calOptions.endOpened = !this.calOptions.endOpened;
      this.calOptions.portfolioAutoGenerationOpened = false;
    } else if (pickerData === 'autogen') {
      this.calOptions.startOpened = false;
      this.calOptions.endOpened = false;
      this.calOptions.portfolioAutoGenerationOpened = !this.calOptions.portfolioAutoGenerationOpened;
    }
  }

  saveUnit(): void {
    this.newUnitService.update(this.unit).subscribe({
      next: (unit) => {
        this.alertService.success('Unit updated.', 2000);
      },
      error: (response) => {
        this.alertService.error(`Failed to update unit. ${response}`, 6000);
      }
    });
  }

}
