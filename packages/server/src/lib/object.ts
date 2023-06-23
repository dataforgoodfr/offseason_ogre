export { ObjectBuilder };

class ObjectBuilder<T extends Record<string | number, any>> {
  private obj: Partial<T> = {};

  /**
   * Augment the object with an object or a key/value pair.
   * @example
   * build
   *  .add({ username: "OGRE", role: "player" })
   *  .add("email", "ogre@atelierogre.com");
   */
  public add<TKey extends keyof T, TObj extends T>(
    keyOrObj: TKey | TObj,
    value?: T[TKey]
  ) {
    if (keyOrObj == null) {
      return this;
    }

    if (typeof keyOrObj === "object") {
      this.obj = { ...this.obj, ...keyOrObj };
    } else if (value !== undefined) {
      this.obj[keyOrObj] = value;
    }

    return this;
  }

  public get() {
    return this.obj;
  }
}
