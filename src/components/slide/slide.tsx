import "./slide.sass";

import {
  Component,
  createRef,
  forwardRef,
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type ISlide = PropsWithChildren<{
  speed?: number;
  hide?: boolean;
  absolute?: boolean;

  fade?: boolean;
  blur?: boolean;
  width?: boolean;
  height?: boolean;
  scale?: boolean;
  swipeTop?: boolean;
  swipeLeft?: boolean;
  swipeRight?: boolean;
  swipeBottom?: boolean;
}>;

export class SlideController extends Component<{ speed: number, setHidden: (v: boolean | ((v: boolean) => boolean)) => any, hidden: boolean; }> {
  get isHide() {
    return this.props.hidden;
  }

  get isShow() {
    return !this.props.hidden;
  }

  async show() {
    this.props.setHidden(false);
    console.log('Show');
    return new Promise<void>(r => setTimeout(r, this.props.speed));
  }

  async hide() {
    this.props.setHidden(true);
    console.log('Hide');
    return new Promise<void>(r => setTimeout(r, this.props.speed));
  }

  async toggle() {
    this.props.setHidden(v => !v);
    return new Promise<void>(r => setTimeout(r, this.props.speed));
  }

  render(): ReactNode {
    return null;
  }
}

export const createRefController = () => createRef<SlideController>();
export const useRefController = () => useRef<SlideController>();

export const Slide = forwardRef<SlideController, ISlide>(({ children, hide, speed = 700, ...props }, ref) => {
  const [hidden, setHidden] = useState(hide ?? false);

  return (
    <>
      <SlideController ref={ref} hidden={hidden} speed={speed} setHidden={setHidden} />
      <div
        className="slide"
        style={{ ['--speed']: `${(speed / 1000)}s` } as any}
        data-absolute={props.absolute || undefined}
        data-swipe-top={props.swipeTop || undefined}
        data-swipe-left={props.swipeLeft || undefined}
        data-swipe-right={props.swipeRight || undefined}
        data-swipe-bottom={props.swipeBottom || undefined}
        data-width={props.width || undefined}
        data-height={props.height || undefined}
        data-scale={props.scale || undefined}
        data-blur={props.blur || undefined}
        data-hide={hidden || undefined}
        data-fade={props.fade || undefined}
      > {children} </div>
    </>
  );
});