# Full List of Algorithms from the Paper (Implementation Reference)

This document lists all distinct algorithms and subroutines described in the research paper “Fold: A Dynamic Barrier Method for Robust Contact and Strain Limiting.”  
Each algorithm is designed to be implemented independently in TypeScript (or another language) to reduce context dependency during code generation by an LLM.

---

## 1. Cubic Barrier Potential
**Purpose:** Penetration-free inequality constraint, \(C^2\) continuous.  
**Inputs:** gap \(g_i\), max gap \(\hat g_i\), frozen stiffness \(ar\kappa_i\).  
**Output:** energy, gradient, Hessian.

---

## 2. Stiffness Design Principle (Semi-Implicit, Elasticity-Inclusive)
**Purpose:** Compute frozen barrier stiffness.  
**Formula:** \(ar\kappa = m/g^2 + \mathbf n \cdot (H \mathbf n)\).

---

## 3. Contact Barrier & Extended Direction
**Purpose:** Handle point-triangle or edge-edge contact.  
**Key:** Use extended direction \( \mathbf w_i = W_i^T (\mathbf p_i - \mathbf q_i) \).

---

## 4. Pin (Point) Constraint Barrier
**Purpose:** Soft pinning using cubic barrier.  
**Formula:** \( ar\kappa^{pin} = m/g^2 + \hat{w}^T H_{ii} \hat{w} \).

---

## 5. Wall Constraint Barrier
**Purpose:** Apply wall or plane constraints using same cubic barrier scheme.  
**Formula:** \( ar\kappa^{wall} = m/g^2 + n_{wall}^T H_{ii} n_{wall} \).

---

## 6. Strain-Limiting Barrier (Triangle-Wise)
**Purpose:** Maintain deformation limits via singular values of the deformation gradient.  
**Formula:** \( ar\kappa^{SL} = m_{face}/gap^2 + w_r^T H_{9x9} w_r \).

---

## 7. Time Integration: Inexact Newton with β-Accumulation
**Purpose:** Main integrator (Algorithm 1).  
**Process:**
1. Outer loop accumulates β.
2. Inner step solves \( H d = f \).
3. Constraint-only line search with 1.25× extended direction.
4. Final error-reduction pass using βΔt.

---

## 8. Constraint-Only Line Search
**Purpose:** Feasibility-only backtracking search to find α ensuring \( g(x+1.25αd) ≤ \hat g \).

---

## 9. Friction Potential (Optional)
**Purpose:** Tangential displacement penalty with stiffness tied to contact force.  
**Formula:** \( ar\kappa^{fric} = μ f_{contact} / \max(ε, ||P_i W_i(x - x_{prev})||) \).

---

## 10. Matrix Assembly with Cached Contact Index Tables
**Purpose:** Explicit assembly with CAMA-style caching to avoid duplicate fill-ins.  
**Tiers:**
1. Block-diagonal
2. Mesh-fixed matrix
3. Contact matrix

---

## 11. Linear Solver & Preconditioning
**Purpose:** Solve \( H d = f \).  
**Method:** PCG with 3×3 block-Jacobi preconditioner.

---

## 12. Gap Evaluators (Geometry Module)
**Purpose:** Compute geometric gaps and fixed normals for all constraint types.

---

## 13. Semi-Implicit Freeze Schedule
**Purpose:** Refresh \(ar\kappa\) each Newton step, then keep frozen for derivative evaluation.

---

## 14. Error-Reduction Pass
**Purpose:** Final Newton pass using βΔt to reduce integration error.

---

## 15. SPD Enforcement for Elasticity Hessian
**Purpose:** Project local Hessians to SPD to ensure stable solves.

---

### Dependency Map
| Category | Depends on |
|-----------|-------------|
| Barriers (1) | Stiffness (2–6), Gaps (12) |
| Integrator (7–8,14) | Barriers, Assembly (10), Solver (11), Freeze (13), Gaps (12) |
| Friction (9) | Contact forces from (3) |
| Assembly (10) | Independent infrastructure |
| Solver (11) | Infrastructure |

---

### Implementation Notes
- Always **freeze** \(ar\kappa\) within each Newton step.
- Use **unit tests** to ensure gradients/Hessians match finite differences.
- Implement constraints (contact, pin, wall, strain) as subclasses of a common BarrierConstraint interface.
- Strain limiting is the mathematically hardest; friction and caching are engineering-heavy but modular.

---

**End of File**