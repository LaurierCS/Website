# LCS admin: how-to for execs

How to post events and keep the team page up to date on [lauriercs.org](https://lauriercs.org), without asking
eng. Everything happens at **[admin.lauriercs.org](https://admin.lauriercs.org)**. It works on a phone too.

- [Getting in](#getting-in)
- [Events](#events)
- [Team](#team)
- [What shows on the site, and when](#what-shows-on-the-site-and-when)
- [When something goes wrong](#when-something-goes-wrong)

## Getting in

**Who can get in:** anyone in the **LCS Discord server** or the **LCS Notion workspace**. Nobody has to add you
by hand. If you're not in either, ask a VP of Engineering.

1. Go to [admin.lauriercs.org](https://admin.lauriercs.org).
2. Press **Continue with Discord** or **Continue with Notion** and sign in with the account that is in the LCS
   server or workspace.
3. The pass says **Checking your pass…**, then **Access granted**, and the Events page opens.

![The login page: a backstage pass with "Continue with Discord" and "Continue with Notion"](admin-guide/01-login.png)

**"You're not on the list (yet)"** means that account isn't in the LCS Discord server or Notion workspace. Join
it (or sign in with the account that is), then press **Check again**.

**Your pass lasts 7 days.** After that the dashboard shows **Your pass ran out**. Press **Renew with Discord** (or
Notion) and sign in again; nothing you saved is lost.

![The "Your pass ran out" message with the Renew button](admin-guide/02-pass-ran-out.png)

## Events

### Post an event

1. On **Events**, press **New event**.
2. Fill in the sheet. Only **Title** and **Date** are needed:
   - **Time:** leave it empty if it isn't set yet.
   - **Location:** leave it empty and the site says "Location TBA".
   - **Description:** what people should know, like what to bring.
   - **Cover picture:** press **Choose a picture** (or drag one in). JPG, PNG, WebP or GIF, up to 5 MB.
3. The ticket on the right shows how the event will look as you type.
4. Press **Create event**. The ticket is stamped **Issued** and you're back on Events, which says
   `Saved "<your title>".`

![The new event form with the ticket preview beside it](admin-guide/03-new-event.png)

### Change or delete an event

1. On **Events**, find the event (the search box looks through titles) and press **Edit**.
2. Change what you need and press **Save changes**. Only what you changed is saved.
   - To swap the picture, press **Choose a different picture**. To take it off, press **Remove picture**.
3. To delete an event, press **Delete** on it in the list, then **Delete** again to confirm. It's gone from the
   site straight away and can't be undone.

![The events list with Edit and Delete on each event](admin-guide/04-events-list.png)

## Team

### Add someone

1. On **Team**, press **Add member**.
2. Fill in the sheet. Only **Name** and **Department** are needed:
   - **Role:** like "VP of Events".
   - **Photo:** press **Choose a picture**, then drag the photo to centre their face and use **Zoom** to fit it
     in the circle. Press **Use this photo**.
   - **GitHub** and **LinkedIn:** paste the whole link, like `https://github.com/their-name`. Leave them empty if
     they don't have one.
   - **On the site:** on by default. Turn it off to add them without showing them yet.
3. The badge on the right shows how they'll look on the Team board.
4. Press **Add member**. The badge drops onto its lanyard and you're back on Team.

![The add member form with the badge preview beside it](admin-guide/05-add-member.png)

![Cropping a photo to fit the circle](admin-guide/06-crop-photo.png)

### Hide someone who has left

On **Team**, turn off the **On the site** switch on their badge. It saves straight away: the badge goes grey
and says **Hidden**, and they disappear from the site. Turn it back on to show them again.

To remove someone for good, press **Delete** on their badge, then **Delete** again to confirm.

![The Team board with one member hidden](admin-guide/07-team-hidden.png)

### Change someone's details

On **Team**, press **Edit** on their badge, change what you need and press **Save changes**.

## What shows on the site, and when

- **Events** and **team members who are on the site** show on lauriercs.org as soon as you save. Reload the page
  to see them.
- **Hidden** team members never show on the site, but stay in the admin so you can bring them back.
- Event times show exactly as saved, like "7:30PM".

## When something goes wrong

- **"… couldn't be saved."** Nothing is lost: what you typed is still on the form. Wait a moment and press save
  again.
- **"The door's jammed."** on the login: wait a minute and press **Try again**. If it keeps happening, sign out
  and sign back in.
- **Anything else, or it keeps failing:** message the eng team in the LCS Discord with what you were doing and a
  screenshot.
