# Hosting Docs

Qilletni may generate docs for a package in a stateful way, allowing for cross-package references for extension methods. For instance, if you have package A with an entity, and package B has an extension method on that entity, when you generate docs, it will update the docs for package A to show the extension method, making it easier to see what functions are available for each type.

Because of this, a stateful cache of the parsed packages is needed. When a package's docs are generated, the internal structure of each file is cached, so the system can easily add extension methods on cross-referenced types.

!!! info

    This page has been truncated and will be rewritten due to a recent overhaul in how docs are hosted.
    For now, see [Qilletni/qilletni-package-docs](https://github.com/Qilletni/qilletni-package-docs) to see how [https://docs.qilletni.dev/](https://docs.qilletni.dev/) is hosted and generated via GitHub Actions.
