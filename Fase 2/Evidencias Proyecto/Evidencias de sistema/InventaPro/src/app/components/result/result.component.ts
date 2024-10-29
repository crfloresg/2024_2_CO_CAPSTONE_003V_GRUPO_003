import { Component, inject, Input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzResultModule, NzResultStatusType } from 'ng-zorro-antd/result';  // Import NzResultStatusType
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [NzResultModule, NzButtonModule, NzTypographyModule],
  template: `
    <nz-result
      [nzStatus]="status"
      [nzTitle]="title"
      [nzSubTitle]="subtitle"
    >
    </nz-result>
  `,
})
export class ResultComponent {

  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() status!: NzResultStatusType;  // Use NzResultStatusType for status

  readonly nzModalData: { title: string, subtitle: string, status: NzResultStatusType } = inject(NZ_MODAL_DATA);

  ngOnInit() {
    this.title = this.nzModalData.title;
    this.subtitle = this.nzModalData.subtitle;
    this.status = this.nzModalData.status;
  }
}
