// Comprehensive Crop Database
const CROP_DATABASE = {
  Wheat: {
                botanicalName: 'Triticum aestivum',
                season: 'Rabi (Winter)',
                daysToMaturity: 120,
                optimalSowingTime: '1st – 20th November',
                rowSpacing: 22.5,
                plantSpacing: 25,
                seedRate: '50–60 kg/acre',
                waterRequirement: 'Moderate - 3-4 irrigations',
                soilConditions: 'Well-prepared, weed-free loam',
                lightProfile: 'Full Sun',
                startMethod: 'Drill Sowing',
                varieties: ['Arooj-22', 'Dilkash-21', 'Fakhr-e-Bakhar', 'Zinkol-16'],
                seedTreatment: 'Thiophanate methyl 2.5 g/kg OR Imidacloprid + Tebuconazole 2 ml/kg',
                criticalIrrigations: ['Tillering (20-25 DAS)', 'Stem elongation (45-50 DAS)', 'Booting (80-95 DAS)'],
                diseases: ['Black Rust', 'Yellow Rust', 'Loose Smut', 'Karnal Bunt'],
                pests: ['Termites', 'Cutworm', 'Aphid', 'Pink Borer'],
                harvestIndicators: ['Stem and leaves turn yellow', 'Grain moisture 25-30%'],
                harvestUnits: 'maunds',
                acres: 668,
                cost: {
                  per_acre: {
                    land_prep: 9800,
                    seed: 5500,
                    seed_treatment: 600,
                    sowing_charges: 2000,
                    irrigation: 14400,
                    fertilizers: 36850,
                    crop_protection: 3600,
                    harvesting_tpt: 6060,
                    total_cost_of_production: 78810
                  },
                  total_for_all_acres: {
                    land_prep: 6546400,
                    seed: 3674000,
                    seed_treatment: 400800,
                    sowing_charges: 1336000,
                    irrigation: 9619200,
                    fertilizers: 24699800,
                    crop_protection: 2404800,
                    harvesting_tpt: 4048080,
                    total_cost_of_production: 52645080
                  }
                }
              },
              'Raya (Mustard)': {
                botanicalName: 'Brassica juncea',
                season: 'Rabi (Winter)',
                daysToMaturity: 90,
                optimalSowingTime: 'Mid-September – Early October',
                rowSpacing: 45,
                plantSpacing: 10,
                seedRate: '1.5–2 kg/acre',
                waterRequirement: 'Very Low – usually rain-fed or 1 irrigation',
                soilConditions: 'Well-drained, slightly sandy to loam soils',
                lightProfile: 'Full Sun',
                startMethod: 'Broadcast or Line Sowing',
                varieties: ['Raya Anmol', 'BARD-1', 'Sultan Raya', 'KS-400'],
                seedTreatment: 'Usually not required (as per your field data)',
                criticalIrrigations: ['Flower initiation', 'Pod formation'],
                diseases: ['Alternaria Blight', 'White Rust', 'Downy Mildew'],
                pests: ['Aphids', 'Painted Bug', 'Sawfly'],
                harvestIndicators: ['Pods turn golden brown', 'Seeds become hard and rattle'],
                harvestUnits: 'maunds',
                acres: 447,
                cost: {
                  per_acre: {
                    land_prep: 10920,
                    seed: 3600,
                    seed_treatment: 0,
                    sowing_charges: 0,
                    irrigation: 10000,
                    fertilizers: 20250,
                    crop_protection: 3600,
                    harvesting_tpt: 7500,
                    total_cost_of_production: 55870
                  },
                  total_for_all_acres: {
                    land_prep: 4881240,
                    seed: 1609200,
                    seed_treatment: 0,
                    sowing_charges: 0,
                    irrigation: 4470000,
                    fertilizers: 9051750,
                    crop_protection: 1609200,
                    harvesting_tpt: 3352500,
                    total_cost_of_production: 24973890
                  }
                }
              },
              'Rhodes Grass': {
                botanicalName: 'Chloris gayana',
                season: 'Warm Season (Spring–Summer)',
                daysToMaturity: 75,
                optimalSowingTime: 'March – May',
                rowSpacing: 30,
                plantSpacing: 15,
                seedRate: '4–6 kg/acre',
                waterRequirement: 'High – 6–8 irrigations',
                soilConditions: 'Sandy loam, well-drained soils',
                lightProfile: 'Full Sun',
                startMethod: 'Broadcast or Drill Sowing',
                varieties: ['Fine Cut', 'Callide', 'Tolgar'],
                seedTreatment: 'Not typically used',
                criticalIrrigations: ['Early establishment', 'Tillering', 'After every cutting'],
                diseases: ['Leaf Spot', 'Rust'],
                pests: ['Armyworm', 'Grasshoppers'],
                harvestIndicators: ['Cut at 50% flowering', 'Soft stems and green leaves'],
                harvestUnits: 'maunds (fresh fodder)',
                acres: 692,
                cost: {
                  per_acre: {
                    land_prep: 4760,
                    seed: 20000,
                    seed_treatment: 0,
                    sowing_charges: 1500,
                    irrigation: 32000,
                    fertilizers: 45100,
                    crop_protection: 2000,
                    harvesting_tpt: 0,
                    total_cost_of_production: 105360
                  },
                  total_for_all_acres: {
                    land_prep: 3293920,
                    seed: 13840000,
                    seed_treatment: 0,
                    sowing_charges: 1038000,
                    irrigation: 22144000,
                    fertilizers: 31209200,
                    crop_protection: 1384000,
                    harvesting_tpt: 0,
                    total_cost_of_production: 72909120
                  }
                }
              }
};

export default CROP_DATABASE;