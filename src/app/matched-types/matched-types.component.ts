import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faEquals } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { SearchItemMasterComponent } from '../dialogs/search-item-master/search-item-master.component';
import { HomeService } from '../home/home.service';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { PreviousUploadsComponent } from '../dialogs/previous-uploads/previous-uploads.component';
import { NavService } from '../nav/nav.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { BannerComponent } from '../utils/banner/banner.component';
import { LoaderComponent } from '../utils/loader/loader.component';
import { MatchedTypesService } from './matched-types.service';

@Component({
  selector: 'app-matched-types',
  templateUrl: './matched-types.component.html',
  styleUrls: ['./matched-types.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MatchedTypesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(BannerComponent) private bannerComponent: BannerComponent;
  @ViewChild(LoaderComponent) private loaderComponent: LoaderComponent;
  possibleMatchSelection;
  drilldownData;
  faCheckCircle = faCheckCircle;
  faCaretRight = faCaretRight;
  faCaretDown = faCaretDown;
  faEquals = faEquals;
  faQuestionCircle = faQuestionCircle;
  faTimesCircle = faTimesCircle;
  faSort = faSort;
  faCircle = faCircle;
  expandedElement;
  routeData;
  displayedColumns: string[] = this.routeData?.match === 'approved' ? ['caret', 'gtin', 'itemMasterID', 'score', 'leadingIndicator', 'gdsnVendor', 'gdsnDescription', 'reassign'] : ['select', 'caret', 'gtin', 'itemMasterID', 'score', 'leadingIndicator', 'gdsnVendor', 'gdsnDescription', 'reassign'];
  dataSource;
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  selection = new SelectionModel(true, []);
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage = '';
  sortArray = [];
  drilldownAssignedItem = [];
  timer;
  constructor(private matDialog: MatDialog,
    private homeService: HomeService,
    private activatedroute: ActivatedRoute,
    private navService: NavService,
    private matchedTypesService: MatchedTypesService) {
    // this.showDashboardData('', '');
    this.pingCalls();
  }

  // columnsToDisplay = [
  //   {
  //     key: 'gtin',
  //     header: 'GTIN',
  //     className: 'something'
  //   },
  //   {
  //     key: 'itemMasterID',
  //     header: 'Item Master ID',
  //     className: 'something'
  //   },
  //   // {
  //   //   key: 'score',
  //   //   header: 'Score',
  //   //   className: 'something'
  //   // },
  //   {
  //     key: 'leadingIndicator',
  //     header: 'Leading Indicator',
  //     className: 'something'
  //   },
  //   // {
  //   //   key: 'gdsnVendor',
  //   //   header: 'Vendor',
  //   //   className: 'something'
  //   // },
  //   // {
  //   //   key: 'gdsnDescription',
  //   //   header: 'GDSN Short Description',
  //   //   className: 'something'
  //   // }
  // ];

  ngOnInit(): void {
    console.log('other here');
    this.activatedroute.data
      .subscribe((data) => {
        console.log(data);
        this.routeData = data;
      });
    this.matchedTypesService.dashboardItemData.subscribe(data => {
      console.log(data);
      // this.setDashboardData(data);
      data ? this.setDashboardData(data) : this.showDashboardData('', '');
    })
  }

  ngAfterViewInit() {
    this.loaderComponent.showLoader(true);
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
  }
  
  pingCalls() {
    this.homeService.pingBackend1()
      .subscribe((response: any) => {
        console.log(response);
      });
    this.homeService.pingBackend2()
      .subscribe((response: any) => {
        console.log(response);
      });
    this.homeService.pingBackend3()
      .subscribe((response: any) => {
        console.log(response);
      });
      this.timer = setTimeout(this.pingCalls.bind(this), 30000);  
  }

  showDetails(event: UIEvent, element): void {
    event.stopPropagation();
    console.log(element);
    // Do whatever with the element
    this.openDialog(element);
  }

  setDashboardData(data) {
    let dataSourceArray = [];
    data.items.filter((i) => {
      if (i.status == 'approved') {
        return i.status == this.routeData.match;
      } else {
        return i.status == this.routeData.match && i.matchType == this.routeData.status;
      }
    })
      .map(element => {
        const obj = {
          gtin: element?.gtin,
          itemMasterID: element?.matchedItem?.itemId,
          score: element?.matchedItem?.score,
          leadingIndicator: element?.matchedItem?.leadIndicatorDisplay,
          gdsnVendor: element?.gdsnVendor.name + element?.gdsnVendor.ipgln === 0 ? '' : element?.gdsnVendor.name + '\n' + element?.gdsnVendor.ipgln,
          gdsnDescription: element.gdsnShortDescription && element?.gdsnShortDescription[0],
          status: element?.status,
          expandData: element.expandedData,
          matchType: element.matchType
        };
        dataSourceArray = [...dataSourceArray, obj]
      });
    this.dataSource = new MatTableDataSource(dataSourceArray);
    this.dataSource.paginator = this.paginator;
    setTimeout(() => {
      this.loaderComponent.showLoader(false);
    }, 100);
    // this.navService.setHeaderData(response.counts);
  }

  showDashboardData(header, ascending) {
    this.homeService.getDashboardData(header, ascending)
      .subscribe((response: any) => {
        console.log('home http response');
        console.log(response);
        let dataSourceArray = [];
        response.items.filter((i) => {
          if (i.status == 'approved') {
            return i.status == this.routeData.match;
          } else {
            return i.status == this.routeData.match && i.matchType == this.routeData.status;
          }
        })
          .map(element => {
            const obj = {
              gtin: element?.gtin,
              itemMasterID: element?.matchedItem?.itemId,
              score: element?.matchedItem?.score,
              leadingIndicator: element?.matchedItem?.leadIndicatorDisplay,
              gdsnVendor: element?.gdsnVendor.name + element?.gdsnVendor.ipgln === 0 ? '' : element?.gdsnVendor.name + '\n' + element?.gdsnVendor.ipgln,
              gdsnDescription: element.gdsnShortDescription && element?.gdsnShortDescription[0],
              status: element?.status,
              expandData: element.expandedData,
              matchType: element.matchType
            };
            dataSourceArray = [...dataSourceArray, obj]
          });
        this.dataSource = new MatTableDataSource(dataSourceArray);
        this.dataSource.paginator = this.paginator;
        this.navService.setHeaderData(response.counts);
        this.matchedTypesService.setDashboardItemData(response);
        this.loaderComponent.showLoader(false);
      }, (error) => {
        this.bannerComponent.changeSuccessMessage('An error has occured while fetching the data. Please try again.', 'danger');
        this.loaderComponent.showLoader(false);
      });
  }

  showDrilldownData(gtin, itemId) {
    this.homeService.getDrilldownData(gtin)
      .subscribe((response: any) => {
        console.log(itemId);
        // response.matchedItems.find(x => x.itemId === itemId).previousSelection = itemId;
        response.matchedItems.forEach(function (element) {
          element.previousSelection = itemId;
        });
        // response.matchedItems.find(x => x.itemId != itemId).checked = null;
        console.log(response);
        this.drilldownData = response;
        this.setDrilldownAssignedItem(itemId);

      }, (error) => {
        this.bannerComponent.changeSuccessMessage('An error has occured while fetching the data. Please try again.', 'danger');
      });
  }

  setDrilldownAssignedItem(itemId) {
    let assignedItem = this.drilldownAssignedItem.filter((x) => {
      return x.itemId === itemId;
    })
    console.log(assignedItem);
    assignedItem.length > 0 ? (assignedItem[0].previousSelection = itemId, this.drilldownData.matchedItems = [...[], assignedItem[0]]) : '';
  }

  approveSelectedItems(items) {
    this.homeService.approveItems(items)
      .subscribe((response: any) => {
        console.log(response);
        this.showDashboardData('', '');
        this.selection.clear();
        this.bannerComponent.changeSuccessMessage('Item has been approved successfully!', 'success');
        this.drilldownAssignedItem = [];
      }, (error) => {
        console.log(error);
        this.bannerComponent.changeSuccessMessage('An error has occured. Please try again.', 'danger');
      });
  }


  openDialog(e) {
    const dialogRef = this.matDialog.open(SearchItemMasterComponent, {
      width: '1000px',
      data: {
        element: e
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.dataSource.filteredData.find(x => x.gtin === result.data.gtin).itemMasterID = result.data.item.itemId;
      this.dataSource.filteredData.find(x => x.gtin === result.data.gtin).score = result.data.item.score;
      this.dataSource.filteredData.find(x => x.gtin === result.data.gtin).leadingIndicator = result.data.item.score;
      this.selection.select(result.data.gtin);
      this.drilldownAssignedItem = [...this.drilldownAssignedItem, result.data.item];
      this.setDrilldownAssignedItem(result.data.item.itemId);
    });
  }

  openPreviousUploads() {
    const dialogRef = this.matDialog.open(PreviousUploadsComponent, {
      width: '1000px',
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  showDrilldown(event: UIEvent, element) {
    console.log(element);
    this.showDrilldownData(element.gtin, element.itemMasterID);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row.gtin));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  approveSelection() {
    console.log(this.selection.selected);
    // this.selection.clear();
    let selectedItems = [];
    console.log(this.dataSource);
    this.selection.selected.map((item) => {
      let obj = {};

      if (item == this.possibleMatchSelection?.gtin) {
        obj = {
          gtin: this.possibleMatchSelection.gtin,
          itemId: this.possibleMatchSelection.itemData.itemId
        };
      } else {
        obj = {
          gtin: item,
          itemId: this.dataSource.filteredData.filter((i) => {
            return i.gtin === item;
          })[0].itemMasterID
        };
      }
      selectedItems = [...selectedItems, obj];
    });
    let items = {
      approver: JSON.parse(sessionStorage.getItem('user')).userName,
      approvedItems: selectedItems
    }
    console.log(items);
    this.approveSelectedItems(items);
  }

  setSelection(e) {
    console.log(e);
    this.possibleMatchSelection = e;
    this.selection.select(e.gtin);
    this.dataSource.filteredData.find(x => x.gtin === e.gtin).itemMasterID = e.itemData.itemId;
    this.dataSource.filteredData.find(x => x.gtin === e.gtin).score = e.itemData.score;
    this.dataSource.filteredData.find(x => x.gtin === e.gtin).leadingIndicator = e.itemData.leadIndicatorDisplay;
  }

  sortTable(header) {
    console.log(header);
    let ascending = true;
    if (this.sortArray.includes(header)) {
      ascending = false;
      this.sortArray.splice(this.sortArray.indexOf(header), 1);
    } else {
      this.sortArray = [...this.sortArray, header];
    }
    console.log(this.sortArray);
    this.showDashboardData(header, ascending)
  }
}
