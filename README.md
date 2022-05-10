# Frontend Wellness Event

Frontend ro provide wellness Event Booking between Vendor and company user with [Next.js](https://nextjs.org/).

## How it works

by default, there are already created accounts, 2 HR and 2 Vendor.

### List Account

Vendor

- username: vendor      password: password
- username: vendor1     password: password

HR

- username: hr      password: password
- username: hr2     password: password

### Business Processes

**Vendor**

- Login vendor

![input username & password](https://res.cloudinary.com/dgvyrkcdh/image/upload/v1652167381/login_as_vendor_dkso4c.png)

Vendor input username & password, while username & password correct will redirect to dashboard

- Dashboard Vendor

![DashboardVendor](https://res.cloudinary.com/dgvyrkcdh/image/upload/v1652167380/List_Booking_Vendor_icpzsj.png)

vendors can only view data related to the vendor itself and can click button View on table.

- View Booking Event

![View Booking Event](https://res.cloudinary.com/dgvyrkcdh/image/upload/v1652167382/View_Button_Vendor_j2rnde.png)

when the vendor clicks the view button, a modal will appear showing all information related to the event and 2 buttons will appear Approve/Reject 

- Approve Button

![Approve Button](https://res.cloudinary.com/dgvyrkcdh/image/upload/v1652167382/After_Vendor_Click_Approved_cikyo1.png)

after clicking the approve button, a new model will appear containing a choice of dates that have been submitted by HR, the vendor must choose one of these dates before submitting.

- Reject Button

![Reject Button](https://res.cloudinary.com/dgvyrkcdh/image/upload/v1652167379/After_Vendor_Click_Reject_k2nqt7.png)

if the vendor presses the reject button, the vendor must provide the reason why the event was rejected

**HR**

- Login HR

![input username & password](https://res.cloudinary.com/dgvyrkcdh/image/upload/v1652167381/login_as_vendor_dkso4c.png)

HR input username & password, while username & password correct will redirect to dashboard

- Dashboard HR

![Dashboard HR](https://res.cloudinary.com/dgvyrkcdh/image/upload/v1652167381/List_Booking_Event_cl7edd.png)

After successful login, HR will be directed to the dashboard and HR will only see their own event data

- Create New Booking Event

![Create New Booking Event](https://res.cloudinary.com/dgvyrkcdh/image/upload/v1652167379/Booking_Event_By_HR_fkmj2m.png)

To make a new event booking, HR can press the Add button and a modal form will appear. HR must choose the event to be submitted, select 3 proposed dates, and event location information

- Show Booking Event

![Show Booking Event](https://res.cloudinary.com/dgvyrkcdh/image/upload/v1652167383/View_Event_HR_arnsun.png)

HR can view the events that have been submitted by pressing the View button

## Deployment

This project is deployed to Heroku, you can access below:

- [Wellness Event Heroku](https://wellness-event.herokuapp.com/)