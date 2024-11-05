Essam Benamar

evb5593@psu.edu

CMPSC 487W

I used Next.js for this project, alongside Firebase

I encoded the images as strings to avoid having to pay for Firebase storage (there is a size limit)


Additional notes on features not mentioned in the requirements:

-Users can only access authorized pages

  -Tenants can access the request form
  
  -Staff can access the form and the list of requests
  
  -Managers can access the form, list of requests, and the tenants list
  
-Logging in is cached

-Logged in users are redirected to their correct pages upon trying to access a page directly (login or unauthorized pages)
