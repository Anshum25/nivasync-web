import type { ClientReference, DeploymentSite } from '@/types/content'

const SRC = 'https://skydotinfotech.com/assets/index-Dj6vDmZa.js (deployment map data)'

export const deploymentsProvenance = {
  tag: 'verified' as const,
  origin: SRC,
  note: 'Named, real, publicly checkable institutions published by the company.',
}

/**
 * 30 named institutional deployment sites, with the coordinates published on the
 * source site. This is the strongest evidence of delivery capability anywhere in
 * the source material: every entry is a real, publicly verifiable institution
 * rather than an anonymous "leading firm".
 */
export const deploymentSites: DeploymentSite[] = [
  { name: 'National Academy of Indian Railways (NAIR), Vadodara', shortName: 'NAIR Vadodara', category: 'academy', lat: 22.3072, lng: 73.1812 },
  { name: 'National Academy of Agricultural Research Management (NAARM), Hyderabad', shortName: 'NAARM Hyderabad', category: 'academy', lat: 17.4399, lng: 78.4983 },
  { name: 'Indian Railways Institute of Mechanical and Electrical Engineering (IRIMEE), Jamalpur', shortName: 'IRIMEE Jamalpur', category: 'academy', lat: 25.3108, lng: 86.4889 },
  { name: 'Indian Railways Institute of Signal and Telecommunication Engineering (IRISET), Secunderabad', shortName: 'IRISET Secunderabad', category: 'academy', lat: 17.3888, lng: 78.4975 },
  { name: 'Indian Railways Institute of Disaster Management (IRIDM), Bengaluru', shortName: 'IRIDM Bengaluru', category: 'academy', lat: 12.9716, lng: 77.5946 },
  { name: 'Multi-Disciplinary Divisional Training Institute (MDDTI), Bengaluru', shortName: 'MDDTI Bengaluru', category: 'academy', lat: 12.9716, lng: 77.5946 },
  { name: 'Specialised Training Institute (STI), Ajmer, Rajasthan', shortName: 'STI Ajmer', category: 'academy', lat: 26.4499, lng: 74.6399 },
  { name: 'Agricultural Co-operative Staff Training Institute (ACSTI), Shimla', shortName: 'ACSTI Shimla', category: 'academy', lat: 31.1048, lng: 77.1734 },

  { name: 'Zonal Railway Training Institute (ZRTI), Udaipur', shortName: 'ZRTI Udaipur', category: 'training-institute', lat: 24.5854, lng: 73.7125 },
  { name: 'Zonal Railway Training Institute (ZRTI), Alipurduar, WB', shortName: 'ZRTI Alipurduar', category: 'training-institute', lat: 26.4835, lng: 89.5269 },
  { name: 'Signal and Telecom Training Institute (STTI), Sabarmati, Ahmedabad', shortName: 'STTI Sabarmati', category: 'training-institute', lat: 23.0712, lng: 72.5806 },
  { name: 'Signal and Telecom Training Institute (STTI), Byculla, Mumbai', shortName: 'STTI Byculla', category: 'training-institute', lat: 18.9757, lng: 72.8328 },
  { name: 'Signal and Telecom Training Institute (STTI), Pandu, Assam', shortName: 'STTI Pandu', category: 'training-institute', lat: 26.1793, lng: 91.6678 },
  { name: 'Signal and Telecom Training Institute (STTI), Podanur, Tamil Nadu', shortName: 'STTI Podanur', category: 'training-institute', lat: 10.9739, lng: 76.9636 },

  { name: 'All India Institute of Medical Science (AIIMS), Jodhpur', shortName: 'AIIMS Jodhpur', category: 'medical-research', lat: 26.2389, lng: 73.0243 },
  { name: 'Institute of Teaching and Research in Ayurveda (ITRA), Jamnagar', shortName: 'ITRA Jamnagar', category: 'medical-research', lat: 22.4707, lng: 70.0577 },

  { name: 'Divisional Railway Manager, Vadodara', shortName: 'DRM Vadodara', category: 'divisional-office', lat: 22.3072, lng: 73.1812 },
  { name: 'Divisional Railway Manager, Jabalpur', shortName: 'DRM Jabalpur', category: 'divisional-office', lat: 23.1815, lng: 79.9864 },
  { name: 'Divisional Railway Manager, Kota', shortName: 'DRM Kota', category: 'divisional-office', lat: 25.2138, lng: 75.8648 },
  { name: 'Divisional Railway Manager, Gwalior', shortName: 'DRM Gwalior', category: 'divisional-office', lat: 26.2124, lng: 78.1772 },
  { name: 'Divisional Railway Manager, Agra', shortName: 'DRM Agra', category: 'divisional-office', lat: 27.1767, lng: 78.0081 },
  { name: 'Divisional Railway Manager, Howrah', shortName: 'DRM Howrah', category: 'divisional-office', lat: 22.5958, lng: 88.311 },
  { name: 'Divisional Railway Manager, Guntakal', shortName: 'DRM Guntakal', category: 'divisional-office', lat: 15.1674, lng: 77.3813 },
  { name: 'Divisional Railway Manager, Secunderabad', shortName: 'DRM Secunderabad', category: 'divisional-office', lat: 17.3888, lng: 78.4975 },
  { name: 'Divisional Railway Manager, Vijayawada', shortName: 'DRM Vijayawada', category: 'divisional-office', lat: 16.5062, lng: 80.648 },
  { name: 'Divisional Railway Manager, Kacheguda', shortName: 'DRM Kacheguda', category: 'divisional-office', lat: 17.3888, lng: 78.4975 },
  { name: 'Divisional Railway Manager, Nanded', shortName: 'DRM Nanded', category: 'divisional-office', lat: 19.1383, lng: 77.321 },
  { name: 'Divisional Railway Manager, Agartala', shortName: 'DRM Agartala', category: 'divisional-office', lat: 23.8315, lng: 91.2868 },

  { name: 'Diesel Loco Shed, Andal, Asansol, WB', shortName: 'Diesel Loco Shed, Andal', category: 'other', lat: 23.5907, lng: 87.1856 },
  { name: "District Institute of Education & Training (DIET'S), Gujarat", shortName: "DIET'S Gujarat", category: 'other', lat: 23.0225, lng: 72.5714 },
]

export const deploymentCategoryLabels: Record<DeploymentSite['category'], string> = {
  academy: 'National academies & institutes',
  'training-institute': 'Zonal & signal/telecom training institutes',
  'medical-research': 'Medical & research institutions',
  'divisional-office': 'Divisional Railway Manager offices',
  other: 'Other deployments',
}

/**
 * Client names published on the source site as logo images.
 *
 * Rendered as a TYPOGRAPHIC ROSTER, not as logo images: the logo files were not
 * available during the audit, third-party logos are the trademarks of their
 * owners, and permission to display them under a *new* corporate brand is
 * unconfirmed. Supply the files plus written permission and the roster component
 * will render them as images instead.
 */
export const clientReferences: ClientReference[] = [
  { name: 'Indian Railways', group: 'public-institution' },
  { name: 'ICAR', group: 'public-institution' },
  { name: 'AIIMS Jodhpur', group: 'public-institution' },
  { name: 'IRISET Secunderabad', group: 'public-institution' },
  { name: 'IRIMEE Jamalpur', group: 'public-institution' },
  { name: 'IRIDM', group: 'public-institution' },
  { name: 'ITRA Jamnagar', group: 'public-institution' },
  { name: 'ZRTI', group: 'public-institution' },
  { name: 'STTI Pandu', group: 'public-institution' },
  { name: 'STTC', group: 'public-institution' },
  { name: "DIET'S Rajkot", group: 'public-institution' },
  { name: "DIET'S Mahesana", group: 'public-institution' },
  { name: 'Diesel Loco Shed', group: 'public-institution' },
  { name: 'HPSCB', group: 'public-institution' },
  { name: 'Shree Lifecare', group: 'enterprise' },
  { name: 'Spectrum Printech', group: 'enterprise' },
  { name: 'Verdict Group', group: 'enterprise' },
  { name: 'VGE LLP', group: 'enterprise' },
  { name: 'Millenio Ventures', group: 'enterprise' },
  { name: 'Metalix', group: 'enterprise' },
  { name: 'Uzalla BioGas', group: 'enterprise' },
  { name: 'Pragna Chemicals', group: 'enterprise' },
  { name: 'Katariya Snacks', group: 'enterprise' },
  { name: '3 Square Design', group: 'enterprise' },
  { name: '7 Star Pune', group: 'enterprise' },
]
