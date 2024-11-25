export const claimReq = {
  ownerOnly: (c: any) => c.role == "Owner",
  seekerOnly: (c: any) => c.role == "Seeker",
  ownerAndSeeker: (c: any) => c.role == "Seeker" || c.role == "Owner"
}