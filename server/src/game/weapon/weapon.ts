export default abstract class Weapon {
  constructor(private ammo: number) {}

  public canShot() {
    return this.ammo > 0;
  }

  public shoot() {
    if (!this.canShot()) return;

    this.innerShoot();
  }

  protected abstract innerShoot(): void;
}
