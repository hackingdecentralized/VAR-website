---
layout: page
title: "Verifiable Aggregate Receipts with Applications to User Engagement Auditing"
subtitle: "Privacy-preserving and scalable auditing for user engagement"
---

<div class="paper-meta">
  <div class="paper-authors">
    <strong>Ioannis Kaklamanis<sup>1</sup></strong>,
    <strong>Wenhao Wang<sup>1</sup></strong>,
    <strong>Harjasleen Malvai<sup>2</sup></strong>,
    <strong>Fan Zhang<sup>1</sup></strong>
  </div>

  <div class="paper-affiliations">
    <div><sup>1</sup> Yale University, IC3</div>
    <div><sup>2</sup> UIUC, IC3</div>
  </div>

  <div class="paper-links">
    <a class="btn btn-primary paper-link-btn" href="https://eprint.iacr.org/2025/2330">ePrint</a>
    <a class="btn btn-primary paper-link-btn" href="https://eprint.iacr.org/2025/2330.pdf">PDF</a>
    <span class="btn btn-default paper-link-btn disabled" aria-disabled="true">Code coming soon</span>
    <span class="btn btn-default paper-link-btn disabled" aria-disabled="true">Slides coming soon</span>
  </div>
</div>

## Abstract

Accurate measurements of user engagement underpin important decisions in various settings, such as determining advertising fees based on viewership of online content, allocating public funding based on a clinic's reported patient volume, or determining whether a group chat app disseminated a message without censorship. While common, self-reporting is inherently untrustworthy due to misaligned incentives.

Motivated by this problem, we introduce the notion of Verifiable Aggregate Receipts (VAR). A VAR system allows an issuer to issue receipts to users and to verify the number of receipts possessed by a prover, who is given receipts upon serving users. An ideal VAR system should satisfy inflation soundness, privacy, and performance at large scale.

We formalize VAR using an ideal functionality and present two novel constructions: S-VAR, which uses bottom-up secret-sharing for tiered fuzzy audits, and P-VAR, which uses bilinear pairings for exact auditing with constant-time verification. We implement both and show practical performance for deployments involving one million users.

## The Story

The paper starts from a simple but stubborn problem: many important services are delivered by an intermediary, but the party paying for the service often has no trustworthy way to verify how many users were actually served. Platforms can over-report views, providers can inflate visit counts, and message delivery systems can make claims that are hard to audit after the fact.

VAR is the paper's answer to that gap. Instead of asking everyone to trust a platform's dashboard, the system gives users receipts as they are served and lets the platform later prove only the aggregate count. That proof should be hard to fake, should not reveal which individual users were involved, and should still be practical at the scale of millions of users.

The figures make this especially concrete through a set of example applications:

- In creator promotion, a creator can pay for boosted views on a platform, but has little visibility into whether the promised number of views was actually delivered or simply self-reported.
- In government health programs, a provider may claim reimbursement for serving a certain number of patients, creating a direct incentive to inflate counts if there is no reliable auditing mechanism.
- In BitTorrent-style reputation systems, an uploader may claim to have contributed more data than they really uploaded, distorting point systems and damaging the integrity of the protocol.

What ties these cases together is the same basic asymmetry: one party controls the service and the reporting, while another party must decide whether to trust a number. The website should make clear that VAR is meant to break that asymmetry by replacing unverifiable self-reporting with cryptographic evidence of aggregate service.

![Engagement auditing for content promotion](/figs/Duke%20Colloquium.027.png)
![Government health programs](/figs/Duke%20Colloquium.028.png)
![BitTorrent reputation systems](/figs/Duke%20Colloquium.029.png)

![Problem statement](/figs/Duke%20Colloquium.032.png)

## What Makes VAR Different

The core design target is not just correctness. It is the combination of three properties at once:

- Inflation soundness: a prover should not be able to claim more engagement than it actually earned.
- Privacy: the verifier should learn the count, not the full set of identities behind the count.
- Deniability and scale: the system should avoid turning user participation into transferable evidence, while remaining efficient enough for large deployments.

That combination is what makes the problem interesting. A naive aggregate-signature approach can compress many user attestations, but it leaks too much and breaks deniability.

![Aggregate signatures are not enough](/figs/Duke%20Colloquium.033.png)

## Two Constructions

The paper presents two complementary constructions rather than a single one-size-fits-all design.

- `S-VAR` is the secret-sharing-based construction. Its strength is simplicity, strong theoretical footing, and tiered auditing. It is a good fit when fuzzy thresholds are acceptable and fast issuance matters.
- `P-VAR` is the pairing-based construction. Its strength is exact auditing and faster proof generation, making it the stronger option when precise counts and fast audits are the priority.

![Comparing the constructions](/figs/Duke%20Colloquium.036.png)

The secret-sharing intuition is especially elegant: if reconstructing a secret requires enough shares, then successfully reconstructing it acts as evidence that the prover collected enough receipts.

![Secret-sharing intuition](/figs/Duke%20Colloquium.037.png)

## A Concrete Application: Bluesky

One of the nicest aspects of the figures is that they turn the abstract protocol into a concrete application. In Bluesky, a creator may want to pay a feed generator to promote content, but still needs a way to verify that the promised delivery really happened.

The story unfolds in four steps:

1. Users who opt into the protocol register public keys through a custom app view.
2. A creator prepares a promotion task and issues encrypted receipts tied to those users.
3. When a user actually sees the promoted content, the app view helps recover the user's receipt and returns it to the feed generator.
4. Later, the feed generator proves the aggregate result to the creator, who audits the claim.

![Bluesky motivation](/figs/z3.png)
![Bluesky setup](/figs/z5.png)
![Promotion task generation](/figs/z6.png)
![View and spend](/figs/z7.png)
![Prove and audit](/figs/z8.png)

This is a strong storytelling example for the website because it shows that VAR is not just an abstract cryptographic primitive. It can be attached to a modern social-media pipeline without replacing the entire application stack.

## Results

The evaluation figures make the final point clearly: the proposed constructions are practical, and they significantly outperform baseline approaches for large-scale audits.

For one million users, the paper reports:

- less than 2 seconds for issuance in both schemes,
- about 34 seconds for proving with the secret-sharing-based construction,
- about 9.7 seconds for proving with the pairing-based construction.

![Evaluation results](/figs/Duke%20Colloquium.043.png)

The website story can therefore end on a clean message: verifiable user-engagement auditing is possible, it can preserve privacy better than obvious alternatives, and it is already efficient enough to matter in real systems.

## Highlights

- Introduces Verifiable Aggregate Receipts for privacy-preserving user engagement auditing.
- Presents two constructions: S-VAR for tiered fuzzy audits and P-VAR for exact audits.
- Provides security proofs with respect to an ideal functionality.
- Benchmarks both schemes at the scale of one million users.

## Citation

```bibtex
@article{kaklamanis2025var,
  title   = {Verifiable Aggregate Receipts with Applications to User Engagement Auditing},
  author  = {Kaklamanis, Ioannis and Wang, Wenhao and Malvai, Harjasleen and Zhang, Fan},
  journal = {Cryptology ePrint Archive},
  year    = {2025},
  url     = {https://eprint.iacr.org/2025/2330}
}
```
