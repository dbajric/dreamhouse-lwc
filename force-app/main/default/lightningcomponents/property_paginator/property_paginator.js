import { Element, track, api } from 'engine';

export default class PropertyPaginator extends Element {
    @track showPreviousButton;
    @track showNextButton;
    @track currentPage;
    @track totalProperties;
    @track totalPages;

    @api
    get page() {
        return this.currentPage;
    }
    set page(value) {
        this.currentPage = value;
        this.updateNavigation();
    }

    @api
    get pages() {
        return this.totalPages;
    }
    set pages(value) {
        this.totalPages = value;
        this.updateNavigation();
    }

    @api
    get total() {
        return this.totalProperties;
    }
    set total(value) {
        this.totalProperties = value;
    }

    /**
     * Updates pagination controls according to total number of pages and the currently selected page.
     */
    updateNavigation() {
        this.showPreviousButton = this.currentPage > 1;
        this.showNextButton = this.currentPage < this.totalPages;
    }

    /**
     * Handler for the Previous Page click event.
     * @param {Event} evt click event.
     */
    previousPage(evt) {
        if (this.currentPage > 1) {
            window.dispatchEvent(new CustomEvent("pageIndexChanged", {
                cancelable: true,
                composed: true,
                bubbles: true,
                detail: {
                    pageIndex: this.currentPage - 1
                }
            }));
        }
    }

    /**
     * Handler for the Next Page click event.
     * @param {Event} evt click event.
     */
    nextPage(evt) {
        if (this.currentPage < this.totalPages) {
            window.dispatchEvent(new CustomEvent("pageIndexChanged", {
                cancelable: true,
                composed: true,
                bubbles: true,
                detail: {
                    pageIndex: this.currentPage + 1
                }
            }));
        }
    }
}
