export const matchData = {
  1: {
    type: "normalMatches",
    guestName: "Sophia Johnson",
    matches: [
      {
        id: "h1",
        name: "The Nakamura Family",
        initials: "NK",
        score: 91,
        explanation: "The Nakamura family is LGBTQ+-affirming and has hosted youth from diverse backgrounds before. Their household is alcohol-free which aligns with Sophia's substance use preferences.",
        criteria: {
          lgbtq: { status: "compatible", label: "LGBTQ+ Safety" },
          dietary: { status: "compatible", label: "Dietary Needs" },
          substance: { status: "compatible", label: "Substance Use" },
          mental: { status: "concern", label: "Mental Health" },
          cultural: { status: "compatible", label: "Cultural Background" },
          struggles: { status: "insufficient", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "compatible", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [],
        tooltips: {
          lgbtq: "Based on: Host Interest section — comfort with LGBTQ+ youth and gender identity",
          dietary: "Based on: Interest as a Guest — dietary requirements and allergies",
          substance: "Based on: Substance Use section — household smoking, alcohol, other substances",
          mental: "Based on: Host Background section — mental health concerns in household",
          cultural: "Based on: Language Proficiency and Background — cultural competency",
          struggles: "Based on: Host Interest — similar past experiences with housing insecurity",
          capacity: "Based on: Host Interest — full-time vs respite, number of youth",
          pets: "Based on: Host basic info — pets in household / Guest allergies",
          parenting: "Based on: Host Interest — willingness to host parenting youth"
        }
      },
      {
        id: "h2",
        name: "Maria Garcia",
        initials: "MG",
        score: 74,
        explanation: "Maria shares a similar cultural background and speaks Spanish, which may provide additional comfort. Note that her household includes a dog — confirm Sophia has no allergies.",
        criteria: {
          lgbtq: { status: "compatible", label: "LGBTQ+ Safety" },
          dietary: { status: "concern", label: "Dietary Needs" },
          substance: { status: "concern", label: "Substance Use" },
          mental: { status: "compatible", label: "Mental Health" },
          cultural: { status: "compatible", label: "Cultural Background" },
          struggles: { status: "compatible", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "concern", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "amber",
            criteria: "Dietary Needs",
            level: "Potential concern",
            explanation: "Maria's dietary accommodations could not be fully verified. Sophia's dietary preferences were not fully captured in her profile.",
            source: "Interest as a Guest — dietary requirements"
          },
          {
            color: "amber",
            criteria: "Pets",
            level: "Potential concern",
            explanation: "Maria's household includes a dog. Sophia has no listed allergies but this should be confirmed before proceeding.",
            source: "Host basic info — pets in household / Guest Interest — allergies"
          },
          {
            color: "amber",
            criteria: "Substance Use",
            level: "Potential concern",
            explanation: "Maria's household substance use policies were not fully confirmed.",
            source: "Substance Use section — host household policies"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest section — LGBTQ+ affirmation confirmed",
          dietary: "Based on: Interest as a Guest — dietary requirements not fully captured",
          substance: "Based on: Substance Use — host household policies not fully confirmed",
          mental: "Based on: Host Background — no concerns noted",
          cultural: "Based on: Language Proficiency — Spanish speaker, shared cultural background",
          struggles: "Based on: Host Interest — similar community experience",
          capacity: "Based on: Host Interest — full-time hosting available",
          pets: "Based on: Host basic info — dog in household",
          parenting: "Based on: Host Interest — parenting youth preference not specified"
        }
      },
      {
        id: "h3",
        name: "David Chen",
        initials: "DC",
        score: 61,
        explanation: "David has experience supporting youth with housing insecurity. However, his household has occasional alcohol use which may conflict with Sophia's profile — coordinator review recommended.",
        criteria: {
          lgbtq: { status: "concern", label: "LGBTQ+ Safety" },
          dietary: { status: "compatible", label: "Dietary Needs" },
          substance: { status: "incompatible", label: "Substance Use" },
          mental: { status: "compatible", label: "Mental Health" },
          cultural: { status: "concern", label: "Cultural Background" },
          struggles: { status: "compatible", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "compatible", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "red",
            criteria: "Substance Use",
            level: "Incompatible",
            explanation: "David's household has occasional alcohol use. Sophia has not confirmed agreement to the host home no-substance-use policy. This conflict requires coordinator review.",
            source: "Substance Use section — Do you agree to no substance use in the host home?"
          },
          {
            color: "amber",
            criteria: "LGBTQ+ Safety",
            level: "Potential concern",
            explanation: "David's LGBTQ+ affirmation level could not be fully confirmed from his host profile.",
            source: "Host Interest — comfort with LGBTQ+ youth"
          },
          {
            color: "amber",
            criteria: "Cultural Background",
            level: "Potential concern",
            explanation: "Shared cultural background or demonstrated cultural competency could not be verified from David's profile.",
            source: "Background — cultural experiences"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — LGBTQ+ affirmation not fully confirmed",
          dietary: "Based on: Interest as a Guest — no dietary conflicts",
          substance: "Based on: Substance Use — occasional alcohol use conflicts with policy",
          mental: "Based on: Host Background — no concerns noted",
          cultural: "Based on: Background — cultural competency not verified",
          struggles: "Based on: Host Interest — experience with housing insecurity",
          capacity: "Based on: Host Interest — full-time hosting confirmed",
          pets: "Based on: Host basic info — no pets",
          parenting: "Based on: Host Interest — not specified"
        }
      }
    ],
    declinedPairs: [
      {
        name: "Roberto Sanchez",
        declinedDate: "08/01/2025",
        reason: "Scheduling conflict",
        declinedBy: "Host"
      }
    ]
  },
  2: {
    type: "noMatches",
    guestName: "Jameson Jack",
    matches: []
  },
  3: {
    type: "singleMatch",
    guestName: "Ava Williams",
    matches: [
      {
        id: "h4",
        name: "Roberto Sanchez",
        initials: "RS",
        score: 68,
        explanation: "Roberto has indicated he is LGBTQ+-affirming and has experience with youth from similar backgrounds. His hosting capacity aligns with Ava's needs, though some lifestyle preferences could not be verified.",
        criteria: {
          lgbtq: { status: "compatible", label: "LGBTQ+ Safety" },
          dietary: { status: "insufficient", label: "Dietary Needs" },
          substance: { status: "concern", label: "Substance Use" },
          mental: { status: "insufficient", label: "Mental Health" },
          cultural: { status: "compatible", label: "Cultural Background" },
          struggles: { status: "concern", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "compatible", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "amber",
            criteria: "Substance Use",
            level: "Potential concern",
            explanation: "Roberto's substance use policies could not be fully confirmed from his host profile.",
            source: "Substance Use — host household policies"
          },
          {
            color: "amber",
            criteria: "Past Struggles",
            level: "Potential concern",
            explanation: "Shared experience with past struggles could not be verified from Roberto's profile.",
            source: "Host Interest — similar past experiences"
          },
          {
            color: "gray",
            criteria: "Dietary Needs",
            level: "Insufficient data",
            explanation: "Ava's dietary requirements were not captured in her intake profile.",
            source: "Interest as a Guest — dietary requirements"
          },
          {
            color: "gray",
            criteria: "Mental Health",
            level: "Insufficient data",
            explanation: "Mental health support capability could not be assessed from available profile data.",
            source: "Host Background — mental health concerns"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — LGBTQ+ affirmation confirmed",
          dietary: "Based on: Interest as a Guest — section not completed by Ava",
          substance: "Based on: Substance Use — policies not fully confirmed",
          mental: "Based on: Host Background — data not available",
          cultural: "Based on: Background — compatible cultural background",
          struggles: "Based on: Host Interest — similar struggles not verified",
          capacity: "Based on: Host Interest — full-time hosting available",
          pets: "Based on: Host basic info — no pets",
          parenting: "Based on: Host Interest — not specified"
        }
      }
    ]
  },
  4: {
    type: "allRedFlags",
    guestName: "Ethan Brown",
    matches: [
      {
        id: "h5",
        name: "James & Linda Park",
        initials: "JP",
        score: 58,
        explanation: "James and Linda have strong hosting experience, but their household has a strict no-smoking policy which conflicts with Ethan's profile.",
        criteria: {
          lgbtq: { status: "concern", label: "LGBTQ+ Safety" },
          dietary: { status: "compatible", label: "Dietary Needs" },
          substance: { status: "incompatible", label: "Substance Use" },
          mental: { status: "compatible", label: "Mental Health" },
          cultural: { status: "concern", label: "Cultural Background" },
          struggles: { status: "compatible", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "compatible", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "red",
            criteria: "Substance Use",
            level: "Incompatible",
            explanation: "James and Linda's household has a strict no-smoking policy which conflicts with Ethan's substance use profile.",
            source: "Substance Use — smoking in home / host household policies"
          },
          {
            color: "amber",
            criteria: "LGBTQ+ Safety",
            level: "Potential concern",
            explanation: "LGBTQ+ affirmation level could not be fully confirmed from James and Linda's profile.",
            source: "Host Interest — LGBTQ+ affirmation"
          },
          {
            color: "amber",
            criteria: "Cultural Background",
            level: "Potential concern",
            explanation: "Shared cultural background or cultural competency could not be verified.",
            source: "Background — cultural experiences"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — affirmation not fully confirmed",
          dietary: "Based on: Interest as a Guest — no dietary conflicts",
          substance: "Based on: Substance Use — strict no-smoking conflicts with profile",
          mental: "Based on: Host Background — no concerns noted",
          cultural: "Based on: Background — cultural competency not verified",
          struggles: "Based on: Host Interest — relevant experience confirmed",
          capacity: "Based on: Host Interest — full-time available",
          pets: "Based on: Host basic info — no pets",
          parenting: "Based on: Host Interest — not specified"
        }
      },
      {
        id: "h6",
        name: "Sarah & Tom W.",
        initials: "ST",
        score: 52,
        explanation: "Sarah and Tom are experienced hosts. However, dietary accommodations and LGBTQ+ affirmation could not be confirmed.",
        criteria: {
          lgbtq: { status: "incompatible", label: "LGBTQ+ Safety" },
          dietary: { status: "incompatible", label: "Dietary Needs" },
          substance: { status: "concern", label: "Substance Use" },
          mental: { status: "compatible", label: "Mental Health" },
          cultural: { status: "insufficient", label: "Cultural Background" },
          struggles: { status: "compatible", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "concern", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "red",
            criteria: "LGBTQ+ Safety",
            level: "Incompatible",
            explanation: "Sarah and Tom's LGBTQ+ affirmation could not be confirmed. This is a critical safety criterion for this placement.",
            source: "Host Interest — comfort with LGBTQ+ youth"
          },
          {
            color: "red",
            criteria: "Dietary Needs",
            level: "Incompatible",
            explanation: "Dietary accommodation requirements conflict with what Sarah and Tom's household can provide.",
            source: "Interest as a Guest — dietary requirements"
          },
          {
            color: "amber",
            criteria: "Substance Use",
            level: "Potential concern",
            explanation: "Substance use policies were not fully confirmed from Sarah and Tom's profile.",
            source: "Substance Use — host household policies"
          },
          {
            color: "amber",
            criteria: "Pets",
            level: "Potential concern",
            explanation: "Sarah and Tom's household has pets. Ethan's allergy status should be confirmed.",
            source: "Host basic info — pets in household"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — affirmation not confirmed, critical issue",
          dietary: "Based on: Interest as a Guest — dietary conflicts confirmed",
          substance: "Based on: Substance Use — policies not confirmed",
          mental: "Based on: Host Background — no concerns",
          cultural: "Based on: Background — insufficient data",
          struggles: "Based on: Host Interest — relevant experience",
          capacity: "Based on: Host Interest — available",
          pets: "Based on: Host basic info — pets present",
          parenting: "Based on: Host Interest — not specified"
        }
      },
      {
        id: "h7",
        name: "The Okonkwo Family",
        initials: "OK",
        score: 48,
        explanation: "The Okonkwo family has hosting capacity and community experience. Substance use policies and mental health support remain unverified.",
        criteria: {
          lgbtq: { status: "compatible", label: "LGBTQ+ Safety" },
          dietary: { status: "compatible", label: "Dietary Needs" },
          substance: { status: "incompatible", label: "Substance Use" },
          mental: { status: "incompatible", label: "Mental Health" },
          cultural: { status: "compatible", label: "Cultural Background" },
          struggles: { status: "concern", label: "Past Struggles" },
          capacity: { status: "concern", label: "Hosting Capacity" },
          pets: { status: "compatible", label: "Pets" },
          parenting: { status: "compatible", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "red",
            criteria: "Substance Use",
            level: "Incompatible",
            explanation: "The Okonkwo family's substance use policies conflict with Ethan's profile requirements.",
            source: "Substance Use — host household policies"
          },
          {
            color: "red",
            criteria: "Mental Health",
            level: "Incompatible",
            explanation: "Mental health support capability could not be confirmed and may conflict with Ethan's needs.",
            source: "Host Background — mental health concerns"
          },
          {
            color: "amber",
            criteria: "Past Struggles",
            level: "Potential concern",
            explanation: "Shared experience with similar past struggles could not be verified.",
            source: "Host Interest — similar experiences"
          },
          {
            color: "amber",
            criteria: "Hosting Capacity",
            level: "Potential concern",
            explanation: "The Okonkwo family's confirmed hosting capacity may be limited for this placement.",
            source: "Host Interest — number of youth / hosting type"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — LGBTQ+ affirming confirmed",
          dietary: "Based on: Interest as a Guest — no dietary conflicts",
          substance: "Based on: Substance Use — policies conflict with requirements",
          mental: "Based on: Host Background — support capability not confirmed",
          cultural: "Based on: Background — compatible background",
          struggles: "Based on: Host Interest — similar struggles not verified",
          capacity: "Based on: Host Interest — capacity may be limited",
          pets: "Based on: Host basic info — no pets",
          parenting: "Based on: Host Interest — willing to host parenting youth"
        }
      }
    ]
  },
  5: {
    type: "singleMatch",
    guestName: "Olivia Martinez",
    matches: [
      {
        id: "h_o1",
        name: "The Nakamura Family",
        initials: "NK",
        score: 72,
        explanation: "The Nakamura family is LGBTQ+-affirming with a welcoming household environment. Their availability and profile align with several of Olivia's placement preferences, though some details could not be fully verified.",
        criteria: {
          lgbtq: { status: "compatible", label: "LGBTQ+ Safety" },
          dietary: { status: "concern", label: "Dietary Needs" },
          substance: { status: "compatible", label: "Substance Use" },
          mental: { status: "compatible", label: "Mental Health" },
          cultural: { status: "compatible", label: "Cultural Background" },
          struggles: { status: "insufficient", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "compatible", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "amber",
            criteria: "Dietary Needs",
            level: "Potential concern",
            explanation: "Olivia's dietary requirements were not fully captured in her intake profile.",
            source: "Interest as a Guest — dietary requirements"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — LGBTQ+ affirmation confirmed",
          dietary: "Based on: Interest as a Guest — dietary section partially completed",
          substance: "Based on: Substance Use — no conflicts identified",
          mental: "Based on: Host Background — no concerns noted",
          cultural: "Based on: Background — compatible cultural environment",
          struggles: "Based on: Host Interest — data not available",
          capacity: "Based on: Host Interest — full-time and respite available",
          pets: "Based on: Host basic info — no pets",
          parenting: "Based on: Host Interest — not specified"
        }
      }
    ]
  },
  6: {
    type: "allRedFlags",
    guestName: "Marcus Lee",
    matches: [
      {
        id: "h_m1",
        name: "James & Linda Park",
        initials: "JP",
        score: 58,
        explanation: "James and Linda have strong hosting experience, but their household has a strict no-smoking policy which conflicts with Marcus's profile.",
        criteria: {
          lgbtq: { status: "concern", label: "LGBTQ+ Safety" },
          dietary: { status: "compatible", label: "Dietary Needs" },
          substance: { status: "incompatible", label: "Substance Use" },
          mental: { status: "compatible", label: "Mental Health" },
          cultural: { status: "concern", label: "Cultural Background" },
          struggles: { status: "compatible", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "compatible", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "red",
            criteria: "Substance Use",
            level: "Incompatible",
            explanation: "No-smoking policy conflicts with Marcus's substance use profile.",
            source: "Substance Use — smoking in home"
          },
          {
            color: "amber",
            criteria: "LGBTQ+ Safety",
            level: "Potential concern",
            explanation: "LGBTQ+ affirmation not fully confirmed.",
            source: "Host Interest — LGBTQ+ affirmation"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — affirmation not fully confirmed",
          dietary: "Based on: Interest as a Guest — no dietary conflicts",
          substance: "Based on: Substance Use — strict no-smoking policy conflicts with Marcus's profile",
          mental: "Based on: Host Background — no concerns noted",
          cultural: "Based on: Background — cultural competency not verified",
          struggles: "Based on: Host Interest — relevant experience confirmed",
          capacity: "Based on: Host Interest — full-time available",
          pets: "Based on: Host basic info — no pets",
          parenting: "Based on: Host Interest — not specified"
        }
      },
      {
        id: "h_m2",
        name: "Sarah & Tom W.",
        initials: "ST",
        score: 52,
        explanation: "Sarah and Tom are experienced hosts. However, dietary accommodations and LGBTQ+ affirmation could not be confirmed.",
        criteria: {
          lgbtq: { status: "incompatible", label: "LGBTQ+ Safety" },
          dietary: { status: "incompatible", label: "Dietary Needs" },
          substance: { status: "concern", label: "Substance Use" },
          mental: { status: "compatible", label: "Mental Health" },
          cultural: { status: "insufficient", label: "Cultural Background" },
          struggles: { status: "compatible", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "concern", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "red",
            criteria: "LGBTQ+ Safety",
            level: "Incompatible",
            explanation: "LGBTQ+ affirmation could not be confirmed. Critical safety criterion.",
            source: "Host Interest — LGBTQ+ youth"
          },
          {
            color: "red",
            criteria: "Dietary Needs",
            level: "Incompatible",
            explanation: "Dietary requirements conflict with host household.",
            source: "Interest as a Guest — dietary"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — affirmation not confirmed, critical issue",
          dietary: "Based on: Interest as a Guest — dietary conflicts confirmed",
          substance: "Based on: Substance Use — policies not confirmed",
          mental: "Based on: Host Background — no concerns",
          cultural: "Based on: Background — insufficient data",
          struggles: "Based on: Host Interest — relevant experience",
          capacity: "Based on: Host Interest — available",
          pets: "Based on: Host basic info — pets present",
          parenting: "Based on: Host Interest — not specified"
        }
      },
      {
        id: "h_m3",
        name: "The Okonkwo Family",
        initials: "OK",
        score: 48,
        explanation: "The Okonkwo family has hosting capacity and community experience. Substance use policies and mental health support remain unverified.",
        criteria: {
          lgbtq: { status: "compatible", label: "LGBTQ+ Safety" },
          dietary: { status: "compatible", label: "Dietary Needs" },
          substance: { status: "incompatible", label: "Substance Use" },
          mental: { status: "incompatible", label: "Mental Health" },
          cultural: { status: "compatible", label: "Cultural Background" },
          struggles: { status: "concern", label: "Past Struggles" },
          capacity: { status: "concern", label: "Hosting Capacity" },
          pets: { status: "compatible", label: "Pets" },
          parenting: { status: "compatible", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "red",
            criteria: "Substance Use",
            level: "Incompatible",
            explanation: "The Okonkwo family's substance use policies conflict with Marcus's profile requirements.",
            source: "Substance Use — host household policies"
          },
          {
            color: "red",
            criteria: "Mental Health",
            level: "Incompatible",
            explanation: "Mental health support capability could not be confirmed and may conflict with Marcus's needs.",
            source: "Host Background — mental health concerns"
          },
          {
            color: "amber",
            criteria: "Past Struggles",
            level: "Potential concern",
            explanation: "Shared experience with similar past struggles could not be verified.",
            source: "Host Interest — similar experiences"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — LGBTQ+ affirming confirmed",
          dietary: "Based on: Interest as a Guest — no dietary conflicts",
          substance: "Based on: Substance Use — policies conflict with requirements",
          mental: "Based on: Host Background — support capability not confirmed",
          cultural: "Based on: Background — compatible background",
          struggles: "Based on: Host Interest — similar struggles not verified",
          capacity: "Based on: Host Interest — capacity may be limited",
          pets: "Based on: Host basic info — no pets",
          parenting: "Based on: Host Interest — willing to host parenting youth"
        }
      }
    ]
  },
  7: {
    type: "noSafeMatches",
    guestName: "Jordan Rivera",
    matches: []
  },
  8: {
    type: "emptyPool",
    guestName: "Tyler Chen",
    matches: []
  },
  11: {
    type: "normalMatches",
    guestName: "Noah Thomas",
    matches: [
      {
        id: "g_n1",
        name: "Alex Rivera",
        initials: "AR",
        score: 88,
        explanation: "Alex's profile aligns well with Noah's household environment. Alex is seeking a full-time placement in a culturally affirming home and has indicated a willingness to participate in weekly check-ins.",
        criteria: {
          lgbtq: { status: "compatible", label: "LGBTQ+ Safety" },
          dietary: { status: "compatible", label: "Dietary Needs" },
          substance: { status: "compatible", label: "Substance Use" },
          mental: { status: "compatible", label: "Mental Health" },
          cultural: { status: "compatible", label: "Cultural Background" },
          struggles: { status: "compatible", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "compatible", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [],
        tooltips: {
          lgbtq: "Based on: Host Interest — affirming household confirmed",
          dietary: "Based on: Interest as a Guest — no dietary restrictions",
          substance: "Based on: Substance Use — guest agrees to household policies",
          mental: "Based on: Host Background — supportive environment available",
          cultural: "Based on: Background — compatible cultural backgrounds",
          struggles: "Based on: Host Interest — relevant experience confirmed",
          capacity: "Based on: Host Interest — full-time placement available",
          pets: "Based on: Host basic info — no pets, no allergies",
          parenting: "Based on: Host Interest — not applicable"
        }
      },
      {
        id: "g_n2",
        name: "Jordan Kim",
        initials: "JK",
        score: 76,
        explanation: "Jordan is seeking a structured placement with experienced hosts. Noah's household and prior hosting background align with Jordan's case plan goals.",
        criteria: {
          lgbtq: { status: "compatible", label: "LGBTQ+ Safety" },
          dietary: { status: "concern", label: "Dietary Needs" },
          substance: { status: "compatible", label: "Substance Use" },
          mental: { status: "compatible", label: "Mental Health" },
          cultural: { status: "concern", label: "Cultural Background" },
          struggles: { status: "compatible", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "compatible", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "amber",
            criteria: "Dietary Needs",
            level: "Potential concern",
            explanation: "Jordan's dietary preferences were not fully captured in their intake profile.",
            source: "Interest as a Guest — dietary requirements"
          },
          {
            color: "amber",
            criteria: "Cultural Background",
            level: "Potential concern",
            explanation: "Shared cultural background could not be fully verified from available profile data.",
            source: "Background — cultural experiences"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — affirming environment confirmed",
          dietary: "Based on: Interest as a Guest — section partially completed",
          substance: "Based on: Substance Use — guest agrees to household policies",
          mental: "Based on: Host Background — no concerns",
          cultural: "Based on: Background — partial match, follow-up recommended",
          struggles: "Based on: Host Interest — relevant hosting experience",
          capacity: "Based on: Host Interest — full-time available",
          pets: "Based on: Host basic info — no pets",
          parenting: "Based on: Host Interest — not specified"
        }
      },
      {
        id: "g_n3",
        name: "Sam Patel",
        initials: "SP",
        score: 63,
        explanation: "Sam has relevant case plan goals that align with Noah's hosting style. Some household compatibility details could not be fully verified from Sam's profile.",
        criteria: {
          lgbtq: { status: "compatible", label: "LGBTQ+ Safety" },
          dietary: { status: "concern", label: "Dietary Needs" },
          substance: { status: "concern", label: "Substance Use" },
          mental: { status: "compatible", label: "Mental Health" },
          cultural: { status: "compatible", label: "Cultural Background" },
          struggles: { status: "insufficient", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "concern", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "amber",
            criteria: "Dietary Needs",
            level: "Potential concern",
            explanation: "Sam's dietary requirements need follow-up confirmation.",
            source: "Interest as a Guest — dietary requirements"
          },
          {
            color: "amber",
            criteria: "Substance Use",
            level: "Potential concern",
            explanation: "Sam's agreement to household substance use policies was not fully confirmed.",
            source: "Substance Use — host household policies"
          },
          {
            color: "amber",
            criteria: "Pets",
            level: "Potential concern",
            explanation: "Sam's allergy status with regard to pets should be confirmed.",
            source: "Host basic info — pets in household"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — affirming household confirmed",
          dietary: "Based on: Interest as a Guest — incomplete section",
          substance: "Based on: Substance Use — agreement not confirmed",
          mental: "Based on: Host Background — no concerns noted",
          cultural: "Based on: Background — compatible",
          struggles: "Based on: Host Interest — data not available",
          capacity: "Based on: Host Interest — placement capacity available",
          pets: "Based on: Host basic info — pet allergy status unconfirmed",
          parenting: "Based on: Host Interest — not specified"
        }
      }
    ],
    declinedPairs: []
  },
  12: {
    type: "normalMatches",
    guestName: "Isabella Garcia",
    matches: [
      {
        id: "ig_h1",
        name: "The Nakamura Family",
        initials: "NK",
        score: 91,
        explanation: "The Nakamura family is LGBTQ+-affirming and has hosted youth from diverse backgrounds before. Their household is alcohol-free which aligns with Isabella's substance use preferences.",
        criteria: {
          lgbtq: { status: "compatible", label: "LGBTQ+ Safety" },
          dietary: { status: "compatible", label: "Dietary Needs" },
          substance: { status: "compatible", label: "Substance Use" },
          mental: { status: "concern", label: "Mental Health" },
          cultural: { status: "compatible", label: "Cultural Background" },
          struggles: { status: "insufficient", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "compatible", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [],
        tooltips: {
          lgbtq: "Based on: Host Interest section — comfort with LGBTQ+ youth and gender identity",
          dietary: "Based on: Interest as a Guest — dietary requirements and allergies",
          substance: "Based on: Substance Use section — household smoking, alcohol, other substances",
          mental: "Based on: Host Background section — mental health concerns in household. Some information was provided but warrants follow-up.",
          cultural: "Based on: Language Proficiency and Background — cultural competency",
          struggles: "Based on: Host Interest — similar past experiences with housing insecurity",
          capacity: "Based on: Host Interest — full-time vs respite, number of youth",
          pets: "Based on: Host basic info — pets in household / Guest allergies",
          parenting: "Based on: Host Interest — willingness to host parenting youth"
        }
      },
      {
        id: "ig_h2",
        name: "Patricia Moore",
        initials: "PM",
        score: 74,
        explanation: "Patricia shares a similar cultural background and is bilingual in English and Spanish, which may provide additional comfort for Isabella. Her household policies align well with the placement requirements.",
        criteria: {
          lgbtq: { status: "compatible", label: "LGBTQ+ Safety" },
          dietary: { status: "concern", label: "Dietary Needs" },
          substance: { status: "compatible", label: "Substance Use" },
          mental: { status: "compatible", label: "Mental Health" },
          cultural: { status: "compatible", label: "Cultural Background" },
          struggles: { status: "compatible", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "concern", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "amber",
            criteria: "Dietary Needs",
            level: "Potential concern",
            explanation: "Patricia's dietary accommodations could not be fully verified from her host profile.",
            source: "Interest as a Guest — dietary requirements"
          },
          {
            color: "amber",
            criteria: "Pets",
            level: "Potential concern",
            explanation: "Patricia's household situation regarding pets should be confirmed before proceeding.",
            source: "Host basic info — pets in household"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — LGBTQ+ affirmation confirmed",
          dietary: "Based on: Interest as a Guest — dietary requirements not fully captured",
          substance: "Based on: Substance Use — no conflicts identified",
          mental: "Based on: Host Background — no concerns noted",
          cultural: "Based on: Language Proficiency — bilingual English/Spanish, compatible background",
          struggles: "Based on: Host Interest — shared community experience",
          capacity: "Based on: Host Interest — full-time hosting available",
          pets: "Based on: Host basic info — pet situation should be confirmed",
          parenting: "Based on: Host Interest — not specified"
        }
      },
      {
        id: "ig_h3",
        name: "Sandra & David Kim",
        initials: "SK",
        score: 68,
        explanation: "Sandra and David have relevant hosting experience and an affirming household. Some lifestyle compatibility details could not be fully verified from the available profile data.",
        criteria: {
          lgbtq: { status: "compatible", label: "LGBTQ+ Safety" },
          dietary: { status: "insufficient", label: "Dietary Needs" },
          substance: { status: "concern", label: "Substance Use" },
          mental: { status: "compatible", label: "Mental Health" },
          cultural: { status: "concern", label: "Cultural Background" },
          struggles: { status: "insufficient", label: "Past Struggles" },
          capacity: { status: "compatible", label: "Hosting Capacity" },
          pets: { status: "compatible", label: "Pets" },
          parenting: { status: "insufficient", label: "Parenting Youth" }
        },
        flags: [
          {
            color: "amber",
            criteria: "Substance Use",
            level: "Potential concern",
            explanation: "Household substance use policies not fully confirmed.",
            source: "Substance Use — host household policies"
          },
          {
            color: "amber",
            criteria: "Cultural Background",
            level: "Potential concern",
            explanation: "Shared cultural background or cultural competency could not be fully verified.",
            source: "Background — cultural experiences"
          },
          {
            color: "gray",
            criteria: "Dietary Needs",
            level: "Insufficient data",
            explanation: "Dietary requirements not captured in profile.",
            source: "Interest as a Guest — dietary requirements"
          }
        ],
        tooltips: {
          lgbtq: "Based on: Host Interest — affirming household confirmed",
          dietary: "Based on: Interest as a Guest — section not completed",
          substance: "Based on: Substance Use — policies not fully confirmed",
          mental: "Based on: Host Background — no concerns noted",
          cultural: "Based on: Background — cultural competency not fully verified",
          struggles: "Based on: Host Interest — data not available",
          capacity: "Based on: Host Interest — full-time hosting available",
          pets: "Based on: Host basic info — no pets",
          parenting: "Based on: Host Interest — not specified"
        }
      }
    ],
    declinedPairs: [
      {
        name: "Roberto Sanchez",
        declinedDate: "03/15/2025",
        reason: "Scheduling conflict",
        declinedBy: "Host"
      }
    ]
  },
  13: {
    type: "insufficientData",
    guestName: "Jacob Wilson",
    matches: [],
    missingSections: [
      {
        name: "LGBTQ+ Affirmation Confirmation",
        reason: "Required for matching with LGBTQ+-identifying guests"
      },
      {
        name: "Substance Use & Household Policies",
        reason: "Critical for determining compatibility with guest profiles"
      },
      {
        name: "Dietary Accommodation Capacity",
        reason: "Needed to match with guests with specific dietary requirements"
      }
    ]
  }
};

export const hostGallery = [
  {
    id: "hg1",
    name: "Sandra & David Kim",
    initials: "SK",
    summary: "Married couple, no children at home, LGBTQ+-affirming with experience hosting diverse youth. Sober household available full-time 3-6 months.",
    signals: {
      lgbtq: true,
      sober: true,
      fullTime: true,
      pets: false
    }
  },
  {
    id: "hg2",
    name: "Patricia Moore",
    initials: "PM",
    summary: "Single woman, bilingual English/Spanish, comfortable with LGBTQ+ youth. No substances in home, available for full-time hosting.",
    signals: {
      lgbtq: true,
      sober: true,
      fullTime: true,
      pets: false
    }
  },
  {
    id: "hg3",
    name: "Roberto & Elena Gomez",
    initials: "RG",
    summary: "Married couple with teenage children, extensive host experience, culturally diverse household. Dog in home — confirm guest allergies.",
    signals: {
      lgbtq: true,
      sober: true,
      fullTime: true,
      pets: true
    }
  },
  {
    id: "hg4",
    name: "The Nakamura Family",
    initials: "NK",
    summary: "Family of three, LGBTQ+-affirming, alcohol-free household. Previous hosting experience with at-risk youth, available full-time and respite.",
    signals: {
      lgbtq: true,
      sober: true,
      fullTime: true,
      pets: false
    }
  },
  {
    id: "hg5",
    name: "James & Linda Park",
    initials: "JP",
    summary: "Married couple, semi-retired, spacious home with private room. No-smoking household. LGBTQ+ affirmation not confirmed — coordinator follow-up recommended.",
    signals: {
      lgbtq: null,
      sober: true,
      fullTime: true,
      pets: false
    }
  }
];
