export function isDuplicate(leads, newLead) {
  return leads.some((lead) => {
    if (newLead.email) {
      return lead.email.toLowerCase() === newLead.email.toLowerCase();
    }
    return (
      !lead.email &&
      lead.firstName === newLead.firstName &&
      lead.surname === newLead.surname &&
      lead.jobPosition === newLead.jobPosition &&
      lead.link === newLead.link &&
      lead.companyName === newLead.companyName &&
      lead.country === newLead.country &&
      lead.industry === newLead.industry
    );
  });
}
