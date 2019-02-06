---
title: "Network Access Control Lists"
date: 2018-03-12T18:09:55+02:00
draft: false
---
# Network Access Control Lists on AWS
Network Access Control Lists (NACLs) are a useful firewall for subnets in a Virtual Private Cloud (VPC).

When designing your NACL rulesets, remember that the default limit for number of rules is 20 and that you can have the limit increased to 40 rules in a NACL. Network performance may be impacted by the processing required for the additional rules.

Also, you can have only one NACL active for each subnet. Different subnets can naturally have different NACLs.

When you take these limits into consideration, you can get the best out of NACLs and not hit a wall after your 39th rule. NACLs are not meant to one to one replacements for your complex firewalls, use the combination of NACLs and Security Groups to create your micro-segmented, multi-layered access control.
